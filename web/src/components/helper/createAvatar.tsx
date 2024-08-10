import React from 'react';
import { Avatar } from 'antd';

export const createAvatar = (name: string, size: number = 40, backgroundColor: string = '#87d068', textColor: string = '#fff') => {
  // Split the name by spaces
  const nameParts = name?.split(' ');
  let initials = '';

  // Get the first and last name initials
  if ( nameParts ) {
    initials = nameParts?.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : nameParts[0][0];
  }

  // Create the avatar
  return (
    <Avatar style={{ backgroundColor, color: textColor, marginRight: '0px' }} size={size}>
      {initials.toUpperCase()}
    </Avatar>
  );
};
