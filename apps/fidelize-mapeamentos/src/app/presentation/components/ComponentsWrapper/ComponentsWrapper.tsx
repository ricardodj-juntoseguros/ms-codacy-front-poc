import styles from './ComponentsWrapper.module.scss';

const ComponentsWrapper: React.FC = ({ children }) => {
  return (
    <div className={styles['components-wrapper__content']}>{children}</div>
  );
};

export default ComponentsWrapper;
