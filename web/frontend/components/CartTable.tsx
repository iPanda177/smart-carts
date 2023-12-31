import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  IndexTable,
  useIndexResourceState,
  Text,
  Toast,
  Divider,
  LegacyCard,
  SkeletonBodyText,
  Banner,
  HorizontalStack,
  VerticalStack,
} from '@shopify/polaris';
import { useMediaQuery } from 'react-responsive';

import { useAuthenticatedFetch } from '../hooks';

import PopupModal from './PopupModal';
import TablePagination from './Pagination';
import IndexTableFilters from './IndexFilters';
import CartBadge from './CartBadge';
import { SubscribtionContext } from '../context/SubscribtionContext';
import Counter from './Counter';
import formatTime from '../services/timeFormatter';
import { useSocket } from '../hooks/useSocket';

type Sort = 'ascending' | 'descending';
type Modal = 'remove' | 'unreserve' | 'expand';

const tableRowsPerPage = 25;

export default function CartsTable() {
  const [currency, setCurrency] = useState(null);
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<Sort>('ascending');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<Modal>('remove');
  const [activeToast, setActiveToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const context = useContext(SubscribtionContext);
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const {
    socket,
    toUpdate
  } = useSocket();

  const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
      useIndexResourceState(carts);

  useEffect(() => {
    if (!toUpdate) return;

    const getCarts = async () => {
      try {
        const result = await fetch(
          `/api/carts/sort?dir=descending&index=5&shop=true`,
        );
        if (!result.ok) throw new Error('Something went wrong');

        const data = await result.json();

        setCurrency(data.shop.currency);
        setCarts(data.sortedCarts);
      } catch (err) {
        console.log(err);
      }
    };

    getCarts().then(() => {
      console.log('updated');
    });
  }, [toUpdate])

  useEffect(() => {
    let ignore = false;
    const getCarts = async () => {
      try {
        if (isLoading) {
          clearSelection();
          const result = await fetch(
            `/api/carts/sort?dir=descending&index=5&shop=true`,
          );
          if (!result.ok) throw new Error('Something went wrong');

          const data = await result.json();

          if (!ignore) {
            setCurrency(data.shop.currency);
            setCarts(data.sortedCarts);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCarts();

    return () => {
      ignore = true;
    };
  }, [isLoading]);

  const resourceName = {
    singular: 'cart',
    plural: 'carts',
  };

  const promotedBulkActions = [
    {
      content: 'Set reservation timer',
      disabled: selectedResources.find(
        cart => cart.reserved_indicator === 'paid',
      ),
      onAction: () => openModal('expand'),
    },
    {
      content: 'Un-reserve all items',
      disabled: selectedResources.find(
        cart => cart.reserved_indicator === 'paid',
      ),
      onAction: () => openModal('unreserve'),
    },
  ];
  const bulkActions = [
    {
      content: 'Remove all items',
      disabled: selectedResources.find(
        cart => cart.reserved_indicator === 'paid',
      ),
      onAction: () => openModal('remove'),
    },
  ];

  const handleSort = useCallback(
    async (index: number, direction: 'ascending' | 'descending') => {
      setIsLoading(true);

      const sortDirection =
        direction === 'descending' ? 'ascending' : 'descending';

      const carts = await fetch(
        `/api/carts/sort?dir=${direction}&index=${index}`,
      );

      if (carts.ok) {
        const cartsData = await carts.json();

        setCarts(cartsData);
        setSortDirection(sortDirection);
        setIsLoading(false);
      }
    },
    [carts, isLoading, sortDirection],
  );

  const openModal = (type: Modal) => {
    setModalType(type);
    setShowModal(true);
  };

  const createModal = () => {
    return (
      <PopupModal
        type={modalType}
        selectedRows={selectedResources}
        setShowModal={setShowModal}
        setIsError={setIsError}
        setActiveToast={setActiveToast}
        setIsLoading={setIsLoading}
      />
    );
  };

  const toggleActiveToast = useCallback(
    () => setActiveToast(active => !active),
    [],
  );

  const toastMarkup = () => {
    switch (true) {
      case modalType === 'remove':
        return (
          <Toast
            content={
              isError
                ? 'Something went wrong. Try again later.'
                : 'All items successfully removed'
            }
            error={isError}
            onDismiss={toggleActiveToast}
          />
        );

      case modalType === 'unreserve':
        return (
          <Toast
            content={
              isError
                ? 'Something went wrong. Try again later.'
                : 'All items successfully unreserved'
            }
            error={isError}
            onDismiss={toggleActiveToast}
          />
        );

      case modalType === 'expand':
        return (
          <Toast
            content={
              isError
                ? 'Something went wrong. Try again later.'
                : 'All items timers successfully expand'
            }
            error={isError}
            onDismiss={toggleActiveToast}
          />
        );
    }
  };

  const paginateData = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getCurrentTableData = () => {
    return carts.slice(
      currentPage * tableRowsPerPage - tableRowsPerPage,
      currentPage * tableRowsPerPage,
    );
  };

  return (
    <Layout>
      {context.plan && context.plan.carts >= context.plan.limit && (
        <Layout.Section>
          <Banner
            title="Cart limit reached!"
            action={{
              content: 'Upgrade plan',
              onAction: () => navigate('/subscribe'),
            }}
            status="warning"
          >
            <p>Upgrade plan to take control of all shopping carts!</p>
          </Banner>
        </Layout.Section>
      )}
      <Layout.Section fullWidth>
        <LegacyCard>
          <IndexTableFilters
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setCarts={setCarts}
            setIsError={setIsError}
            setActiveToast={setActiveToast}
          />
          {!isLoading ? (
            <IndexTable
              onSort={handleSort}
              resourceName={resourceName}
              itemCount={carts.length}
              defaultSortDirection={sortDirection}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              bulkActions={bulkActions}
              promotedBulkActions={promotedBulkActions}
              condensed={isMobile}
              sortable={[true, true, true, true, true, true]}
              headings={[
                // { title: 'Cart ID' },
                { title: 'Customer' },
                { title: 'Cart Total' },
                { title: 'Reserved Status' },
                { title: 'Next expiring item' },
                { title: 'Items' },
                { title: 'Last action' },
              ]}
            >
              {isMobile
                ? getCurrentTableData().map(
                    (
                      {
                        id,
                        customer_name,
                        qty,
                        total: cartTotal,
                        reservation_time,
                        reserved_indicator,
                        last_action,
                      },
                      index,
                    ) => {
                      return (
                        <div
                          key={id}
                          onClick={() => navigate(`/cart/${id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <IndexTable.Row
                            id={id}
                            key={id}
                            selected={selectedResources.includes(id)}
                            position={index}
                            onClick={() => navigate(`/cart/${id}`)}
                          >
                            <div
                              style={{ padding: '12px 16px', width: '100%' }}
                            >
                              <VerticalStack gap="1">
                                <Text
                                  as="span"
                                  variant="bodySm"
                                  color="subdued"
                                >
                                  {formatTime(
                                    Date.now() -
                                      new Date(last_action).getTime(),
                                  )}
                                </Text>
                                <HorizontalStack align="space-between">
                                  <Text
                                    as="span"
                                    variant="bodyMd"
                                    fontWeight="semibold"
                                  >
                                    {customer_name}
                                  </Text>
                                  <Text as="span" variant="bodyMd">
                                    {new Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: currency,
                                    }).format(cartTotal)}
                                  </Text>
                                </HorizontalStack>
                                <HorizontalStack align="start" gap="1">
                                  <CartBadge
                                    indicator={reserved_indicator}
                                  ></CartBadge>
                                  <Counter
                                    expireAt={reservation_time}
                                    status={
                                      reserved_indicator === 'paid'
                                        ? 'paid'
                                        : 'expiring'
                                    }
                                  ></Counter>
                                </HorizontalStack>
                              </VerticalStack>
                            </div>
                          </IndexTable.Row>
                        </div>
                      );
                    },
                  )
                : getCurrentTableData().map(
                    (
                      {
                        id,
                        customer_name,
                        qty,
                        total: cartTotal,
                        reservation_time,
                        reserved_indicator,
                        last_action,
                      },
                      index,
                    ) => {
                      return (
                        <IndexTable.Row
                          id={id}
                          key={id}
                          selected={selectedResources.includes(id)}
                          position={index}
                          onClick={() => navigate(`/cart/${id}`)}
                        >
                          <IndexTable.Cell>
                            {customer_name || 'Unlogged user'}
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: currency,
                            }).format(cartTotal)}
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <CartBadge
                              indicator={reserved_indicator}
                            ></CartBadge>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <Counter
                              expireAt={reservation_time}
                              status={
                                reserved_indicator === 'paid'
                                  ? 'paid'
                                  : 'expiring'
                              }
                            ></Counter>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            {qty > 1 ? `${qty} items` : `${qty} item`}
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            {formatTime(
                              Date.now() - new Date(last_action).getTime(),
                            )}
                          </IndexTable.Cell>
                        </IndexTable.Row>
                      );
                    },
                  )}
            </IndexTable>
          ) : (
            <LegacyCard.Section>
              <SkeletonBodyText lines={25} />
            </LegacyCard.Section>
          )}
          {showModal && createModal()}
          {activeToast && toastMarkup()}
          <Divider />
          <LegacyCard.Section>
            {carts.length > tableRowsPerPage && (
              <TablePagination
                tableRowsPerPage={tableRowsPerPage}
                totalData={carts.length}
                paginateData={paginateData}
                currentPage={currentPage}
              />
            )}
          </LegacyCard.Section>
        </LegacyCard>
      </Layout.Section>
    </Layout>
  );
}
