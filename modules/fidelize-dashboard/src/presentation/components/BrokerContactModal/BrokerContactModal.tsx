import { useState } from 'react';
import { Alert, Button, InputBase, Modal, TextArea } from 'junto-design-system';
import { emailValidator } from '@shared/utils';
import TagManager from 'react-gtm-module';
import { SuccessIllustration } from '@shared/ui';
import styles from './BrokerContactModal.module.scss';
import BrokerContactApi from '../../../application/features/brokerContact/BrokerContactApi';

interface BrokerContactModalProps {
  isOpen: boolean;
  onCloseModal: () => void;
}

interface ContactFormProps {
  onSubmit: () => void;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [contactEmail, setContactEmail] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const isValidEmail = () => {
    return emailValidator(contactEmail);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    TagManager.dataLayer({
      dataLayer: {
        event: 'ClickNoOpportunitiesMappedSubmitButton',
      },
    });
    BrokerContactApi.sendBrokerContactLead(contactEmail, question)
      .then(() => onSubmit())
      .catch(() => setError(true))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className={styles['broker-contact-modal__wrapper']}>
      <InputBase
        data-testid="input-contact-email"
        value={contactEmail}
        onChange={e => setContactEmail(e.target.value)}
        placeholder="exemplo@mail.com"
        label="Informe seu e-mail"
      />
      <TextArea
        data-testid="input-contact-question"
        label="Você tem alguma dúvida?"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Escreva aqui a sua dúvida"
        maxLength={500}
      />
      {error && (
        <Alert
          variant="error"
          width={280}
          text=" Ocorreu um erro inesperado ao realizar a sua solicitação. Por favor,
        tente novamente."
        />
      )}
      <Button
        data-testid="submit-btn"
        disabled={!isValidEmail()}
        onClick={() => handleSubmit()}
      >
        {isSubmitting
          ? ((<i className="icon icon-loading" />) as any)
          : 'Enviar'}
      </Button>
    </div>
  );
};

const BrokerContactModal: React.FC<BrokerContactModalProps> = ({
  isOpen,
  onCloseModal,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const getModalTemplate = () => {
    if (!hasSubmitted) {
      return {
        title: { value: 'Solicitar contato comercial', align: 'center' as any },
        text: {
          value:
            'Informe seu melhor e-mail para contato, e se já quiser adiantar a sua dúvida fique a vontade.',
          align: 'center' as any,
        },
      };
    }
    return {
      title: {
        value: 'Contato solicitado!',
        align: 'center' as any,
      },
      text: {
        value: 'Em breve retornaremos para o e-mail informado.',
        align: 'center' as any,
      },
      icon: <SuccessIllustration />,
    };
  };

  return (
    <Modal
      size="default"
      open={isOpen}
      template={getModalTemplate()}
      onBackdropClick={() => onCloseModal()}
      onClose={() => onCloseModal()}
    >
      {!hasSubmitted && <ContactForm onSubmit={() => setHasSubmitted(true)} />}
    </Modal>
  );
};

export default BrokerContactModal;
