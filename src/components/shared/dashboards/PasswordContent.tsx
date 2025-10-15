'use client';

import React, { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { checkUserAuthMethodAction, updatePasswordAction, setPasswordAction } from '@/lib/supabase/actions';
import type { ActionState } from '@/lib/auth/middleware';

// Submit 버튼 컴포넌트
function SubmitButton({ isPasswordAuth }: { isPasswordAuth: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primaryColor text-white py-2 px-4 rounded-lg hover:bg-primaryColor-dark disabled:opacity-50"
    >
      {pending ? 'Processing...' : isPasswordAuth ? 'Update Password' : 'Set Password'}
    </button>
  );
}

const PasswordContent = () => {
  const [authMethod, setAuthMethod] = useState<{
    hasPasswordAuth: boolean;
    socialProviders: string[];
    email?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state - 이메일 사용자용
  const [updateState, updateFormAction] = useFormState<ActionState, FormData>(
    updatePasswordAction,
    { error: '' }
  );

  // Form state - 소셜 로그인 사용자용
  const [setState, setFormAction] = useFormState<ActionState, FormData>(
    setPasswordAction,
    { error: '' }
  );

  // 사용자 인증 방법 확인
  useEffect(() => {
    const checkAuthMethod = async () => {
      const result = await checkUserAuthMethodAction();

      if ('error' in result) {
        console.error('인증 방법 확인 실패:', result.error);
        setLoading(false);
        return;
      }

      setAuthMethod({
        hasPasswordAuth: result.hasPasswordAuth || false,
        socialProviders: result.socialProviders || [],
        email: result.email,
      });
      setLoading(false);
    };

    checkAuthMethod();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-blackColor dark:text-blackColor-dark">Loading...</p>
      </div>
    );
  }

  if (!authMethod) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-red-500">Failed to load authentication information.</p>
      </div>
    );
  }

  const state = authMethod.hasPasswordAuth ? updateState : setState;
  const formAction = authMethod.hasPasswordAuth ? updateFormAction : setFormAction;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blackColor dark:text-blackColor-dark">
        {authMethod.hasPasswordAuth ? 'Change Password' : 'Set Password'}
      </h2>

      <form className="space-y-6" action={formAction}>
        {/* 소셜 로그인 사용자 안내 메시지 */}
        {!authMethod.hasPasswordAuth && authMethod.socialProviders.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              You signed in with {authMethod.socialProviders.join(', ')}.
              {' '}Set a password to enable email/password login as well.
            </p>
          </div>
        )}

        {/* 현재 비밀번호 (이메일 사용자만) */}
        {authMethod.hasPasswordAuth && (
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Current password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryColor dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        )}

        {/* 새 비밀번호 */}
        <div>
          <label
            htmlFor={authMethod.hasPasswordAuth ? 'newPassword' : 'password'}
            className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2"
          >
            {authMethod.hasPasswordAuth ? 'New Password' : 'Password'}
          </label>
          <input
            type="password"
            id={authMethod.hasPasswordAuth ? 'newPassword' : 'password'}
            name={authMethod.hasPasswordAuth ? 'newPassword' : 'password'}
            placeholder={authMethod.hasPasswordAuth ? 'Enter new password' : 'Enter password'}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryColor dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryColor dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* 성공 메시지 */}
        {state?.success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
          </div>
        )}

        {/* 에러 메시지 */}
        {state?.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
          </div>
        )}

        {/* Submit 버튼 */}
        <SubmitButton isPasswordAuth={authMethod.hasPasswordAuth} />
      </form>
    </div>
  );
};

export default PasswordContent;
