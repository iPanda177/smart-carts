import { MediaCard } from '@shopify/polaris';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedFetch } from '../hooks';

export default function MediaCardBanner({ plan }: any) {
  const [isOpen, setIsOpen] = useState(plan ? plan.tutorial : false);
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();

  return (
    <div style={{ display: !isOpen ? 'none' : 'block' }}>
      <MediaCard
        title="Getting Started"
        primaryAction={{
          content: 'Learn about getting started',
          onAction: () => navigate('/faq'),
        }}
        description="Discover how to set up Better Carts functionality."
        popoverActions={[
          {
            content: 'Dont show this again',
            onAction: () => {
              fetch('/api/shop/tutorial');
              setIsOpen(false);
            },
          },
        ]}
        size="small"
      >
        <img
          alt=""
          width="100%"
          height="100%"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          src="https://thumbs.dreamstime.com/b/shopping-cart-fire-fast-shopping-concept-shopping-cart-fire-fast-shopping-concept-184933462.jpg"
        />
      </MediaCard>
    </div>
  );
}