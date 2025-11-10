'use client';

import styles from './styles/r.menutabs.module.css';
import { motion } from 'framer-motion';

type TabType = 'info' | 'nonverbal' | 'answer-feedback';

interface MenuTabProps {
  answerId: string;
  tabs: { key: string; label: string }[];
  activeTab: TabType;
  onTabClick: (key: TabType) => void;
}

const MenuTabs = ({ answerId, tabs, activeTab, onTabClick }: MenuTabProps) => {
  return (
    <div className={styles.menuTabs}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            onClick={() => {
              onTabClick(tab.key as TabType);
            }}
            key={tab.key}
            className={`${styles.menuTabButton} ${isActive ? styles.active : ''}`}
          >
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                className={styles.underline}
                layoutId={`moving-underline-${answerId}`}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 40,
                  mass: 0.35,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MenuTabs;
