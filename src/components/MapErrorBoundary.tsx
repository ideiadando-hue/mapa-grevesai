'use client';

import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class MapErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[MapErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            color: '#6b7280',
            fontSize: 14,
          }}
        >
          Não foi possível carregar o mapa. Recarregue a página.
        </div>
      );
    }

    return this.props.children;
  }
}