import { LoadingButton } from '@mui/lab';
import { Container, Paper, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { InputPassword } from 'components';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signIn } from 'reducers/profileSlice';
import { authRoute } from 'routes';
import { authService } from 'services';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { control, handleSubmit } = useForm({ mode: 'onChange' });

  const { mutate: login, isLoading } = useMutation(authService.login, {
    onSuccess: ({ accessToken }) => {
      dispatch(signIn({ accessToken }));
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleClickSubmit();
    }
  };

  const handleClickSubmit = () => {
    handleSubmit((values) => {
      login(values);
    })();
  };

  return (
    <Container component={Paper} maxWidth='sm' className='flex flex-col gap-10 p-8'>
      <Controller
        name='username'
        defaultValue={state?.username ?? ''}
        control={control}
        rules={{
          required: 'Tài khoản không được để trống',
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            variant='standard'
            label='Tài khoản'
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Controller
        name='password'
        defaultValue={state?.password ?? ''}
        control={control}
        rules={{
          required: 'Mật khẩu không được để trống',
        }}
        render={({ field, fieldState: { error } }) => (
          <InputPassword
            {...field}
            fullWidth
            variant='standard'
            label='Mật khẩu'
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <LoadingButton fullWidth variant='contained' loading={isLoading} onClick={handleClickSubmit}>
        Đăng nhập
      </LoadingButton>

      <div className='flex justify-center space-x-2 mt-[-20px]'>
        <span>Bạn chưa có tài khoản?</span>
        <Link className='font-bold hover:text-primary-main' to={authRoute.register.url}>
          Đăng ký ngay
        </Link>
      </div>
    </Container>
  );
};

export default LoginScreen;
