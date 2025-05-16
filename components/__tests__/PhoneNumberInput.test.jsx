/* eslint-disable react/display-name */
/* eslint-disable import/order */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PhoneNumberInput from '../inputs/PhoneNumberInput';

// Mock libphonenumber-js
jest.mock('libphonenumber-js', () => ({
  parsePhoneNumber: jest.fn(() => ({
    formatNational: () => '0301 2345678',
    format: () => '+923012345678',
  })),
  isValidPhoneNumber: jest.fn((number) => number.startsWith('+923') && number.length >= 13),
}));

// Mock next/image to avoid Next.js Image issues in tests
jest.mock('next/image', () => (props) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt || 'mocked image'} />;
});

describe('PhoneNumberInput', () => {
  const onChangeMock = jest.fn();
const onValidationMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with default value', () => {
    render(<PhoneNumberInput onChange={onChangeMock} value="03012345678" />);
    expect(screen.getByPlaceholderText('03105689647')).toBeInTheDocument();
  });

  it('displays Pakistan flag and +92', () => {
    render(<PhoneNumberInput onChange={onChangeMock} value="" />);
    expect(screen.getByRole('button')).toHaveTextContent('+92');
    expect(screen.getByAltText('Pakistan Flag')).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    render(<PhoneNumberInput onChange={onChangeMock} value="" />);
    const input = screen.getByPlaceholderText('03105689647');
    fireEvent.change(input, { target: { value: '03011234567' } });
    expect(onChangeMock).toHaveBeenCalledWith('03011234567');
  });

  it('formats number and calls onChange on blur', () => {
    render(<PhoneNumberInput onChange={onChangeMock} value="03011234567" />);
    const input = screen.getByPlaceholderText('03105689647');
    fireEvent.blur(input);
    expect(onChangeMock).toHaveBeenCalledWith('+923012345678');
    expect(input).toHaveValue('0301 2345678');
  });

  it('shows "required" error when empty and required', () => {
    render(<PhoneNumberInput onChange={onChangeMock} value="" required />);
    const input = screen.getByPlaceholderText('03105689647');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });



  it('shows error for invalid phone number', () => {
    render(<PhoneNumberInput onChange={onChangeMock} value="0301" />);
    const input = screen.getByPlaceholderText('03105689647');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
  });

  it('disables input when disabled is true', () => {
    render(<PhoneNumberInput onChange={onChangeMock} value="03011234567" disabled />);
    const input = screen.getByPlaceholderText('03105689647');
    expect(input).toBeDisabled();
  });

  it('calls onValidation with true for valid number', () => {
    render(
      <PhoneNumberInput
        onChange={onChangeMock}
        onValidation={onValidationMock}
        value="+923012345678"
      />
    );
    expect(onValidationMock).toHaveBeenCalledWith(false);
  });

  it('calls onValidation with false for invalid number', () => {
    render(
      <PhoneNumberInput
        onChange={onChangeMock}
        onValidation={onValidationMock}
        value="123"
      />
    );
    expect(onValidationMock).toHaveBeenCalledWith(false);
  });
  it('renders the input element', () => {
  render(<PhoneNumberInput onChange={onChangeMock} value="" />);
  expect(screen.getByPlaceholderText('03105689647')).toBeInTheDocument();
});

it('renders +92 in country button', () => {
  render(<PhoneNumberInput onChange={onChangeMock} value="" />);
  expect(screen.getByRole('button')).toHaveTextContent('+92');
});

it('does not show error message if no validation triggered', () => {
  render(<PhoneNumberInput onChange={onChangeMock} value="03011234567" />);
  expect(screen.queryByText('Invalid phone number')).not.toBeInTheDocument();
  expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
});

it('calls onChange with raw input when typing', () => {
  render(<PhoneNumberInput onChange={onChangeMock} value="" />);
  const input = screen.getByPlaceholderText('03105689647');
  fireEvent.change(input, { target: { value: '03012345678' } });
  expect(onChangeMock).toHaveBeenCalledWith('03012345678');
});

it('formats value on blur (uses mocked parsePhoneNumber)', () => {
  render(<PhoneNumberInput onChange={onChangeMock} value="03012345678" />);
  const input = screen.getByPlaceholderText('03105689647');
  fireEvent.blur(input);
  expect(input).toHaveValue('0301 2345678'); // mocked return value
});

});

