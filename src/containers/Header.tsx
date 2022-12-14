import { Logout, Menu } from '@mui/icons-material';
import { AppBar, Avatar, Button, Divider, Drawer, IconButton, Toolbar } from '@mui/material';
import { AppBreadcrumb, AppMenu } from 'containers';
import { useWindowSize } from 'hooks';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { profileSelector, signOut } from 'reducers/profileSlice';
import { privateRoute } from 'routes';

const Header = () => {
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();
  const { isLoggedIn } = useSelector(profileSelector);

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor='left'
        open={isMobile ? openDrawer : true}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ style: { width: '280px', padding: '8px 16px' } }}
      >
        <div className='flex justify-center items-center h-12 gap-3'>
          <Link to={privateRoute.home.path}>
            <img src={require('assets/icons/Github.png')} className='h-10' />
          </Link>
          <span className='font-medium text-2xl text-primary-main'>Free Admin</span>
        </div>
        <Divider className='my-2' />
        <AppMenu />
      </Drawer>

      <AppBar position='sticky' color='transparent' elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton onClick={() => setOpenDrawer(true)} className='mr-2'>
              <Menu />
            </IconButton>
          )}
          <AppBreadcrumb />
          <div className='flex-1' />

          {isLoggedIn ? (
            <div className='flex'>
              <IconButton className='mr-3' onClick={() => dispatch(signOut({}))}>
                <Logout />
              </IconButton>
              <Button variant='outlined'>
                <Avatar className='h-6 w-6 mr-2'>K</Avatar>
                {'Admin'}
              </Button>
            </div>
          ) : (
            <Button variant='outlined'>Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
