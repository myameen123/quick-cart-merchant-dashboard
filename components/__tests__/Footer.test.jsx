/* eslint-disable import/order */
// components/__tests__/Footer.test.jsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../footer/Footer';

describe('Footer', () => {
  it('renders the footer component', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('displays the correct text', () => {
    render(<Footer />);
    expect(screen.getByText(/All rights reserved by Fashion Corner/i)).toBeInTheDocument();
  });

  it('displays the current year dynamically', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
  });
});
