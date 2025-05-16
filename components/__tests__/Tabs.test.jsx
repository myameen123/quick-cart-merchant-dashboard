/* eslint-disable import/order */
/* eslint-disable react/display-name */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../ui/tabs'

// import xyx from "../../lib/utils"
// Mocks
jest.mock('@radix-ui/react-tabs', () => {
  const actual = jest.requireActual('@radix-ui/react-tabs')
  return {
    __esModule: true,
    ...actual,
    Root: ({ children, ...props }) => (
      <div data-testid="tabs-root" {...props}>{children}</div>
    ),
    List: React.forwardRef(({ children, ...props }, ref) => (
      <div data-testid="tabs-list" ref={ref} {...props}>{children}</div>
    )),
    Trigger: React.forwardRef(({ children, ...props }, ref) => (
      <button role="tab" data-testid="tabs-trigger" ref={ref} {...props}>
        {children}
      </button>
    )),
    Content: React.forwardRef(({ children, value, ...props }, ref) => (
      <div
        role="tabpanel"
        data-testid={`tabs-content-${value}`}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )),
  }
})

jest.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}))

// Tests
describe('Tabs component', () => {
  it('renders Tabs root', () => {
    render(<Tabs>Test</Tabs>)
    expect(screen.getByTestId('tabs-root')).toBeInTheDocument()
  })

  it('renders TabsList with children', () => {
    render(
      <Tabs>
        <TabsList>List Content</TabsList>
      </Tabs>
    )
    expect(screen.getByTestId('tabs-list')).toHaveTextContent('List Content')
  })

  it('renders TabsTrigger as a button with role=tab', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    const trigger = screen.getByRole('tab')
    expect(trigger).toHaveTextContent('Tab 1')
  })

  it('applies custom className to TabsTrigger', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" className="custom-class">
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(screen.getByTestId('tabs-trigger')).toHaveClass('custom-class')
  })

  it('renders TabsContent with correct value', () => {
    render(
      <Tabs>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    )
    expect(screen.getByTestId('tabs-content-tab1')).toHaveTextContent('Content 1')
  })

  it('applies focus-visible ring classes to content', () => {
    render(<TabsContent value="tab2" className="focus-visible:ring-2">Test</TabsContent>)
    expect(screen.getByTestId('tabs-content-tab2')).toHaveClass('focus-visible:ring-2')
  })

  it('TabsTrigger supports disabled state', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" disabled>
            Disabled Tab
          </TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(screen.getByRole('tab')).toBeDisabled()
  })

  it('TabsContent renders multiple contents correctly', () => {
    render(
      <Tabs>
        <TabsContent value="tab1">One</TabsContent>
        <TabsContent value="tab2">Two</TabsContent>
      </Tabs>
    )
    expect(screen.getByTestId('tabs-content-tab1')).toHaveTextContent('One')
    expect(screen.getByTestId('tabs-content-tab2')).toHaveTextContent('Two')
  })

  it('TabsTrigger can receive onClick handlers', () => {
    const handleClick = jest.fn()
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" onClick={handleClick}>
            Clickable Tab
          </TabsTrigger>
        </TabsList>
      </Tabs>
    )
    fireEvent.click(screen.getByText('Clickable Tab'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('TabsList renders with default styling', () => {
    render(
      <Tabs>
        <TabsList />
      </Tabs>
    )
    expect(screen.getByTestId('tabs-list')).toHaveClass(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground'
    )
  })
})
