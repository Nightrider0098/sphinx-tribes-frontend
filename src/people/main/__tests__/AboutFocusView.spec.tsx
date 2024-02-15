import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { aboutSchema } from 'components/form/schema';
import { user } from '__test__/__mockData__/user';
import AboutFocusView from '../AboutFocusView';
import { formConfig } from '../editUserModal/config';
import { Modal } from 'components/common';


type MockFetch = jest.MockedFunction<typeof fetch>;
const failureMockFetch = (fetch as unknown as MockFetch).mockImplementation((url) => {
  if (typeof url === 'string' && url.endsWith('/profile')) {
    return Promise.resolve({
      json: () => Promise.reject({
        success:false,
        error:'Failed to update profile'
      })
    } as Response);
  }
  return Promise.reject(new Error('Unknown endpoint'));
});
const successMockFetch = (fetch as unknown as MockFetch).mockImplementation((url) => {
  if (typeof url === 'string' && url.endsWith('/profile')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        user
      })
    } as Response);
  }
  return Promise.reject(new Error('Unknown endpoint'));
});


describe('BountyModalButtonSet Component', () => {
  it('Should close edit profile modal if update api is successful', () => {
    const props = {
      "person": user,
      "canEdit": true,
      "selectedIndex": 1,
      "config": formConfig,
      "onSuccess": jest.fn(),
      "goBack": jest.fn(),
      }
      const wasCalledWithUrl = failureMockFetch.mock.calls.some((call: any) =>
      String(call[1]).includes('gobounties/filter/count')
    );
    render(
      <Modal visible={true} fill>
          <AboutFocusView {...props} />
      </Modal>
          );
    expect(screen.getByText("Save")).toBeInTheDocument();
    screen.getByText("Save").click()
    expect(wasCalledWithUrl).toBe(true);
    expect(screen.getByText("Failed to update profile")).toBeInTheDocument();
  });
});
