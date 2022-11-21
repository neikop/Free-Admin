import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Spinner } from 'components';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { transactionService } from 'services';
import { formatBalance } from 'utils/common';

const TabWithdraw = () => {
  const { data, isFetching } = useQuery(['transactionService.getWithdraw'], () => transactionService.getWithdraw());
  const isLong = Number(data?.withdrawals.length) > 10;

  return (
    <Spinner loading={isFetching}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thời gian</TableCell>
              <TableCell align='right'>Số tiền</TableCell>
              <TableCell align='right'>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.withdrawals.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{DateTime.fromISO(item.createdAt).toFormat('HH:ss dd/MM/yyyy')}</TableCell>
                <TableCell align='right' className='text-success'>
                  {formatBalance(item.amount)}
                </TableCell>
                <TableCell align='right'>
                  {item.status === 'APPROVED' ? (
                    <div className='text-info'>Đã rút</div>
                  ) : item.status === 'REJECTED' ? (
                    <div className='text-error'>Từ chối</div>
                  ) : (
                    <div className='text-neutral'>Chờ</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        className='pt-[8px] inset-0 top-[unset] bottom-[100px] max-w-[600px] mx-auto'
        style={{
          backgroundColor: '#F5F5F5',
          position: isLong ? 'fixed' : 'static',
          padding: isLong ? 8 : 0,
        }}
      >
        <div className='w-full h-[40px] bg-warning-gradient rounded-full'>
          <div className='h-full flex justify-between items-center px-[16px]'>
            <div className='flex space-x-1'>
              <span>Tổng số đơn:</span>
              <span className='font-bold'>{data?.totalWithdrawls ?? 0}</span>
            </div>
            <div className='flex space-x-1'>
              <span>Lợi nhuận:</span>
              <span className='font-bold'>{formatBalance(data?.totalWithdrawAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </Spinner>
  );
};
export default TabWithdraw;
