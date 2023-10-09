import styles from './TextHelper.module.scss';

export interface TextHelperProps {
 title: string;
 text: string[];
}

export function TextHelper({
  title,
  text,
}: TextHelperProps) {


  const renderText = () => {
    return text.map(item => (
      <p>{item}</p>
      ));
  };

  return (
      <div className={styles['search_registration_container_section_helper']}>
        <div className={styles['search_registration_container_section_helper_text']}>
          <h2>{title}</h2>
          {renderText()}
        </div>
      </div>
  );
};
