/* eslint-disable import/order */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
 // __mocks__/radix-ui__react-alert-dialog.js
jest.mock('@radix-ui/react-alert-dialog', () => {
  const React = require('react');
  return {
    Root: ({ children }) => <div data-testid="root">{children}</div>,
    Trigger: ({ children, ...props }) => (
      <button {...props} data-testid="trigger">{children}</button>
    ),
    Portal: ({ children }) => <div data-testid="portal">{children}</div>,
    Overlay: React.forwardRef((props, ref) => <div ref={ref} data-testid="overlay" {...props} />),
    Content: React.forwardRef((props, ref) => <div ref={ref} data-testid="content" {...props} />),
    Header: (props) => <div data-testid="header" {...props} />,
    Footer: (props) => <div data-testid="footer" {...props} />,
    Title: React.forwardRef((props, ref) => <h2 ref={ref} data-testid="title" {...props} />),
    Description: React.forwardRef((props, ref) => <p ref={ref} data-testid="description" {...props} />),
    Action: React.forwardRef((props, ref) => <button ref={ref} data-testid="action" {...props} />),
    Cancel: React.forwardRef((props, ref) => <button ref={ref} data-testid="cancel" {...props} />),
  };
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '../ui/alert-dialog'; // Adjust the import path

describe('AlertDialog Component', () => {
  it('renders the trigger button', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
      </AlertDialog>
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('renders dialog content with title and description', () => {
    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>This action is irreversible.</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByTestId('title')).toHaveTextContent('Delete Item');
    expect(screen.getByTestId('description')).toHaveTextContent('This action is irreversible.');
  });

  it('renders footer with action and cancel buttons', () => {
    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByTestId('cancel')).toHaveTextContent('Cancel');
    expect(screen.getByTestId('action')).toHaveTextContent('Confirm');
  });

  it('calls action button callback on click', () => {
    const onConfirm = jest.fn();
    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
    fireEvent.click(screen.getByTestId('action'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls cancel button callback on click', () => {
    const onCancel = jest.fn();
    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
    fireEvent.click(screen.getByTestId('cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('applies custom classes', () => {
    render(
      <AlertDialog>
        <AlertDialogContent className="custom-class">Content</AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByTestId('content')).toHaveClass('custom-class');
  });


  it('dialog content should be visible when rendered', () => {
    render(
      <AlertDialog>
        <AlertDialogContent>Visible Content</AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByTestId('content')).toHaveTextContent('Visible Content');
  });
});
