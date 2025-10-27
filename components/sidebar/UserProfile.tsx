'use client';

import { useState } from 'react';
import styles from './styles/bottom.user.module.css';

import LoginUserModal from './LoginUserModal';

import { User2Icon } from 'lucide-react';

const UserProfile = ({
  user,
}: {
  user: { id: string; name: string; email: string };
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.item}>
      {isModalOpen && <LoginUserModal onClose={() => setIsModalOpen(false)} />}
      <button
        className={styles.bottomWrapper}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div className={styles.profile}>
          <User2Icon />
        </div>
        <div className={styles.user}>
          <p className={styles.name}>{user.name}</p>
          <p className={styles.email}>{user.email}</p>
        </div>
      </button>
    </div>
  );
};

export default UserProfile;
