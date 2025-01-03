//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattButtonComponent, WattButtonTypes } from './watt-button.component';

type WattButtonOptions = Partial<
  Pick<WattButtonComponent, 'icon' | 'variant' | 'type' | 'formId' | 'disabled' | 'loading'>
>;

const testId = 'watt-button-text';

describe(WattButtonComponent, () => {
  const renderComponent = async (options: WattButtonOptions & { text?: string }) => {
    return await render<WattButtonComponent>(
      `<watt-button
        [variant]="variant"
        [icon]="icon"
        [type]="type"
        [loading]="loading"
        data-testid=${testId}
        [disabled]="disabled"
        [formId]="formId">
           ${options.text ?? 'Text'}
        </watt-button>`,
      {
        componentProperties: {
          ...options,
        },
        imports: [WattButtonComponent],
      }
    );
  };

  it('renders default options', async () => {
    await render(`<watt-button data-testid=${testId}>Default button</watt-button>`, {
      imports: [WattButtonComponent],
    });

    const button = screen.queryByTestId(testId)?.querySelector('button');

    expect(button).toHaveTextContent('Default button');
    expect(screen.queryByTestId(testId)).toHaveClass('watt-button--primary');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toHaveClass('mat-button-disabled');
    expect(button).not.toHaveAttribute('form');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders icon when icon is set', async () => {
    await renderComponent({ icon: 'plus' });

    expect(screen.getByRole('img')).toHaveClass('mat-icon');
  });

  test.each(WattButtonTypes)('renders variant "%s" as a class', async (variant) => {
    await renderComponent({ variant, text: 'Text' });

    const button = screen.queryByTestId(testId);

    if (variant === 'icon') {
      expect(button).not.toHaveTextContent('Text');
    }

    expect(button).toHaveClass('watt-button--' + variant);
  });

  it('supports reset type', async () => {
    await renderComponent({ type: 'reset' });

    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('supports submit type', async () => {
    await renderComponent({ type: 'submit' });

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('has "form" attribute when type is "submit" and "formId" is set', async () => {
    await renderComponent({
      type: 'submit',
      formId: 'test-form-id',
    });

    expect(screen.getByRole('button')).toHaveAttribute('form', 'test-form-id');
  });

  it('does NOT have "form" attribute when type is "submit" and "formId" is NOT set', async () => {
    await renderComponent({
      type: 'submit',
    });

    expect(screen.getByRole('button')).not.toHaveAttribute('form');
  });

  it('can be disabled', async () => {
    const wrapperComponent = await renderComponent({
      disabled: true,
    });
    const wattButton = wrapperComponent.container.querySelector('watt-button');

    expect(wattButton).toHaveClass('watt-button--disabled');
    expect(wattButton).toHaveStyle({
      'pointer-events': 'none',
    });

    if (wattButton) {
      expect(() => userEvent.click(wattButton)).toThrow();
    }
  });

  it('renders loading spinner, but no text, when loading is true', async () => {
    await renderComponent({ loading: true, text: 'Text' });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Text')).toHaveClass('content-wrapper--loading');
  });
});
