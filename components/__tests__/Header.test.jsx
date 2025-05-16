/* eslint-disable import/order */
/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../header/Header';
// import Menu from '../header/Menu';
jest.mock('next/image', () => (props) => {
  // simplified mock of next/image
  return <img {...props} alt={props.alt || 'image'} />;
});

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock Menu component if needed
jest.mock('../header/Menu', () => () => <div data-testid="menu-component">Menu</div>);


describe('Header', () => {
  it('renders the logo image', () => {
    render(<Header />);
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/Quick-Checkout.svg');
  });

  it('links to /signin page', () => {
    render(<Header />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/signin');
  });

  it('renders the navigation container', () => {
    render(<Header />);
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });

  it('renders the Menu component', () => {
    render(<Header />);
    const menu = screen.getByTestId('menu-component');
    expect(menu).toBeInTheDocument();
  });
});

