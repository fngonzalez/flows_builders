import { Button } from '@cognite/aura/components/button';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@cognite/aura/components/empty-state';
import { Component } from 'react';
import type { ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode; onRecover?: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <EmptyState>
        <EmptyStateTitle>Something went wrong</EmptyStateTitle>
        <EmptyStateDescription>
          Your other investigations are safe. Try loading this workspace again.
        </EmptyStateDescription>
        <EmptyStateActions>
          <Button
            onClick={() => {
              if (this.props.onRecover) this.props.onRecover();
              else this.setState({ failed: false });
            }}
          >
            {this.props.onRecover ? 'Reload workspace' : 'Retry panel'}
          </Button>
        </EmptyStateActions>
      </EmptyState>
    );
  }
}
