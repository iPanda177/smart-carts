import {
  LegacyCard,
  Text,
  Button,
  VerticalStack,
  HorizontalStack,
  LegacyStack,
  Divider,
} from '@shopify/polaris';
import { SubscribtionContext } from '../context/SubscribtionContext';
import { useContext } from 'react';

type Props = {
  title: string;
  currentPlan: string;
  limit: number;
  info: string[];
  price: number;
  description: string;
  onClick: () => void;
  selectedPlan: string;
  children?: any;
};

export const BillingCard = ({
  title,
  currentPlan,
  limit,
  info,
  price,
  description,
  onClick,
  selectedPlan,
  children,
}: Props) => {
  const context = useContext(SubscribtionContext);

  return (
    <>
      <LegacyCard sectioned>
        <VerticalStack gap="4">
          <Text as="h2" variant="headingXl">
            {title}
          </Text>

          <LegacyStack vertical>
            {info.map((item, index) => (
              <Text as="p" variant="bodyMd" color="subdued" key={index}>
                {item}
              </Text>
            ))}

            {!price ? <div style={{ height: '107px' }}></div> : null}
          </LegacyStack>

          <Divider></Divider>

          {price ? (
            <div>
              <Text as="p" variant="bodySm" color="subdued">
                {`Starting at`}
              </Text>

              <HorizontalStack gap="2" blockAlign="baseline">
                <Text
                  as="p"
                  fontWeight="bold"
                  variant="heading3xl"
                  color="success"
                >
                  {`$${price}`}
                </Text>

                <Text as="p" variant="bodyMd">
                  {`USD/month`}
                </Text>
              </HorizontalStack>

              <Text as="p" variant="bodySm" color="subdued">
                {`Billed monthly`}
              </Text>
            </div>
          ) : null}

          <Button
            onClick={onClick}
            primary
            disabled={
              currentPlan === title ||
              context.plan.carts >= limit ||
              (selectedPlan !== null && selectedPlan !== title)
            }
            loading={selectedPlan === title}
          >
            {description}
          </Button>
        </VerticalStack>
      </LegacyCard>
      {children}
    </>
  );
};
