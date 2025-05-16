/* eslint-disable jsx-a11y/role-has-required-aria-props */
/* eslint-disable import/order */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
} from '../ui/dropdown-menu'

// Mocks
jest.mock('@radix-ui/react-dropdown-menu', () => {
  const originalModule = jest.requireActual('@radix-ui/react-dropdown-menu')
  return {
    __esModule: true,
    ...originalModule,
    Root: ({ children }) => <div data-testid="root">{children}</div>,
    Trigger: ({ children }) => <button data-testid="trigger">{children}</button>,
    Content: ({ children }) => <div data-testid="content">{children}</div>,
    Item: ({ children, ...props }) => (
      <div role="menuitem" {...props}>{children}</div>
    ),
    CheckboxItem: ({ children, ...props }) => (
      <div role="checkbox" {...props}>{children}</div>
    ),
    RadioItem: ({ children, ...props }) => (
      <div role="radio" {...props}>{children}</div>
    ),
    Label: ({ children }) => <div data-testid="label">{children}</div>,
    Separator: () => <hr data-testid="separator" />,
    Sub: ({ children }) => <div data-testid="sub">{children}</div>,
    SubTrigger: ({ children }) => <div data-testid="sub-trigger">{children}</div>,
    SubContent: ({ children }) => <div data-testid="sub-content">{children}</div>,
    Portal: ({ children }) => <div data-testid="portal">{children}</div>,
    RadioGroup: ({ children }) => <div data-testid="radio-group">{children}</div>,
    ItemIndicator: () => <span data-testid="item-indicator" />,
  }
})

jest.mock('lucide-react', () => ({
  Check: () => <svg data-testid="icon-check" />,
  Circle: () => <svg data-testid="icon-circle" />,
  ChevronRight: () => <svg data-testid="icon-chevron" />,
}))

// Tests
describe('DropdownMenu component', () => {
  it('renders trigger and content', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByTestId('trigger')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('renders a checkbox item with correct role', () => {
    render(
      <DropdownMenu>
        <DropdownMenuCheckboxItem>Check Me</DropdownMenuCheckboxItem>
      </DropdownMenu>
    )
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders a radio item with correct role', () => {
    render(
      <DropdownMenuRadioGroup>
        <DropdownMenuRadioItem>Radio 1</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    )
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('renders label, separator and shortcut', () => {
    render(
      <DropdownMenuContent>
        <DropdownMenuLabel>Label</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
      </DropdownMenuContent>
    )
    expect(screen.getByTestId('label')).toHaveTextContent('Label')
    expect(screen.getByTestId('separator')).toBeInTheDocument()
    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  it('renders sub menu with trigger and content', () => {
    render(
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>Sub Item</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    )
    expect(screen.getByTestId('sub-trigger')).toHaveTextContent('More')
    expect(screen.getByTestId('sub-content')).toBeInTheDocument()
  })



  it('handles item click', () => {
    const handleClick = jest.fn()
    render(
      <DropdownMenu>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleClick}>Click Me</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders inset item with padding', () => {
    render(
      <DropdownMenuContent>
        <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
      </DropdownMenuContent>
    )
    expect(screen.getByText('Inset Item')).toBeInTheDocument()
  })



  it('renders full dropdown with nested structure', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuCheckboxItem>Toggle</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem>Choice A</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>SubItem</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Actions')).toBeInTheDocument()
    expect(screen.getByText('Toggle')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })
})
