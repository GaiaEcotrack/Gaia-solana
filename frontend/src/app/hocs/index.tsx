import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';

const providers = [BrowserRouter];

function withProviders(Component: ComponentType) {
  return () => providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
}

export { withProviders };
