import { useNotification, useNotificationByUserId } from '@/services/notification.service'
import { useTaskManagement, useTaskManagementById } from '@/services/tastManagement.service'
import { getAuth } from '@/utils/auth';
import React, { useEffect, useState } from 'react'
import { useMemo } from 'react'
import moment from 'moment';

function NotificationPage() {

  const [message, setMessage] = React.useState('');

  const [userId, setUserId] = React.useState('');
  const [createdAt, setCreatedAt] = React.useState('');
  const [userName, setUserName] = React.useState('')

  const getUserId = async () => {
    const decodedToken = await getAuth();
    if (decodedToken?.token) {
      setUserId(decodedToken.userId);
    }
  };

  useEffect(() => {
    getUserId();
  }, [getAuth]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [query, setQuery] = useState("");

  const searchObj = useMemo(

    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );


  


  const { data: notificationByUser } = useNotification(searchObj);




  const filteredNotifications = notificationByUser?.data.filter((item: any) => item?.userId === userId);





  // const {data: TaskManagementById} = useTaskManagementById(Notification?.taskId); 
  // const {data : notificationById}  = useNotificationById(Notification?._id);


  //   console.log(userId, "check userId")
  // useEffect(() => {
  //   refetch();
  // }, [userId, refetch]);

  return (
    <div className=''>

      {filteredNotifications && filteredNotifications.length > 0 ? (
        filteredNotifications.map((item: any) => (
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 w-[90%] p-4 m-4" key={item.id}>
            <p className="text-gray-800 font-medium text-base">{item.message}</p>
            <p className="text-gray-500 text-sm mt-2">{moment(item.createdAt).format("DD-MM-YYYY, HH:mm")}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-base">No notifications available.</p>
      )}
    </div>

  )
}

export default NotificationPage