/* eslint-disable import/order */
/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThresholdDisplay from '../../app/admin/checkout/_components/ThresholdDisplay';

describe('ThresholdDisplay Component', () => {
  const thresholds = [0.5, 0.8];
  const title = 'Aggressive';
  const color = 'destructive';

  beforeEach(() => {
    render(<ThresholdDisplay title={title} thresholds={thresholds} color={color} />);
  });

  it('renders the title correctly', () => {
    expect(screen.getByText(`${title} Risk Profile`)).toBeInTheDocument();
  });

  it('renders the Low, Medium, and High labels with correct values', () => {
    expect(screen.getByText('Low: 0 - 0.50')).toBeInTheDocument();
    expect(screen.getByText('Medium: 0.50 - 0.80')).toBeInTheDocument();
    expect(screen.getByText('High: 0.80 - 1')).toBeInTheDocument();
  });

  it('renders the button with correct text and variant', () => {
    const button = screen.getByRole('button', { name: `${title} Profile Applied` });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });



it('renders three colored segments for risk levels', () => {
  const segments = document.querySelectorAll('.h-4.bg-gray-300 > div');
  expect(segments.length).toBe(3); // low, medium, high
});

it('correctly applies width styles to colored segments', () => {
  const segments = document.querySelectorAll('.h-4.bg-gray-300 > div');

  // Extract the style.width values
  const lowWidth = segments[0].style.width;
  const mediumWidth = segments[1].style.width;
  const highWidth = segments[2].style.width;

  expect(lowWidth).toBe('50%');
  expect(mediumWidth).toBe('30.000000000000004%');
  expect(highWidth).toBe('19.999999999999996%');
});

it('renders two thumb indicators with correct positioning', () => {
  const thumbIndicators = document.querySelectorAll('.absolute.h-5.w-5.bg-blue-600');
  expect(thumbIndicators.length).toBe(2);

  // Optionally check for left style (for position)
  expect(thumbIndicators[0].style.left).toBe('calc(50% - 10px)');
  expect(thumbIndicators[1].style.left).toBe('calc(80% - 10px)');
});


  it('renders rounded full sliders for visual correctness', () => {
    const slider = screen.getByText(`${title} Risk Profile`).nextSibling;
    expect(slider).toHaveClass('rounded-full');
  });

  it('renders all thresholds as fixed to 2 decimal places', () => {
    expect(screen.getByText('Low: 0 - 0.50')).toBeInTheDocument();
    expect(screen.getByText('Medium: 0.50 - 0.80')).toBeInTheDocument();
    expect(screen.getByText('High: 0.80 - 1')).toBeInTheDocument();
  });

  it('does not render any interactive element other than the disabled button', () => {
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toBeDisabled();
  });
});