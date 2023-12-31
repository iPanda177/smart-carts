import { Badge } from '@shopify/polaris';

type Props = {
  indicator: 'all' | 'part' | 'no' | 'unsynced' | 'paid';
};

export default function CartBadge({ indicator }: Props) {
  switch (true) {
    case indicator === 'paid':
      return (
        <Badge progress="complete" status="info">
          Paid
        </Badge>
      );

    case indicator === 'unsynced':
      return <Badge progress="complete">Unsynced</Badge>;

    case indicator === 'all':
      return (
        <Badge status="success" progress="complete">
          Reserved
        </Badge>
      );

    case indicator === 'part':
      return (
        <Badge status="attention" progress="partiallyComplete">
          Partially Reserved
        </Badge>
      );

    case indicator === 'no':
      return (
        <Badge status="warning" progress="incomplete">
          Unreserved
        </Badge>
      );
  }
}
