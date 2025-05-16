/* eslint-disable react/display-name */
/* eslint-disable import/order */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion'; 

// Mock @radix-ui/react-accordion
jest.mock('@radix-ui/react-accordion', () => ({
  __esModule: true,
  Root: ({ children, ...props }) => <div data-testid="accordion-root" {...props}>{children}</div>,
  Item: React.forwardRef((props, ref) => <div ref={ref} data-testid="accordion-item" {...props} />),
  Header: ({ children, ...props }) => <div data-testid="accordion-header" {...props}>{children}</div>,
  Trigger: React.forwardRef((props, ref) => <button ref={ref} data-testid="accordion-trigger" {...props} />),
  Content: React.forwardRef((props, ref) => <div ref={ref} data-testid="accordion-content" {...props} />),
}));

// Mock ChevronDown from lucide-react
jest.mock('lucide-react', () => ({
  ChevronDown: () => <svg data-testid="chevron-icon" />,
}));

describe('Accordion Component', () => {
  it('renders Accordion root correctly', () => {
    render(<Accordion type="single" />);
    expect(screen.getByTestId('accordion-root')).toBeInTheDocument();
  });

  it('renders AccordionItem inside Accordion', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">Item 1</AccordionItem>
      </Accordion>
    );
    expect(screen.getByTestId('accordion-item')).toBeInTheDocument();
  });

  it('renders AccordionTrigger with children', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Open Me</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Open Me')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
  });

  it('renders AccordionContent with children', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionContent>This is the content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('This is the content')).toBeInTheDocument();
  });

  it('calls onClick handler when AccordionTrigger is clicked', () => {
    const handleClick = jest.fn();
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger onClick={handleClick}>Click Me</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    );
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('AccordionContent is hidden by default (data-state closed)', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionContent data-state="closed">Hidden Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const content = screen.getByText('Hidden Content');
    expect(content.parentElement).toHaveAttribute('data-state', 'closed');
  });

  it('AccordionContent is visible when open (data-state open)', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionContent data-state="open">Visible Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const content = screen.getByText('Visible Content');
    expect(content.parentElement).toHaveAttribute('data-state', 'open');
  });

  it('AccordionTrigger applies custom className', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger className="my-trigger-class">Trigger</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Trigger').className).toMatch(/my-trigger-class/);
  });

  it('AccordionContent applies additional className', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionContent className="extra-style">Some content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const content = screen.getByText('Some content').parentElement;
    expect(content.className).toMatch("overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down");
  });

  it('AccordionItem handles forwarded ref', () => {
    const ref = React.createRef();
    render(
      <Accordion>
        <AccordionItem value="item-1" ref={ref}>
          Item with ref
        </AccordionItem>
      </Accordion>
    );
    expect(ref.current).not.toBeNull();
  });
});
