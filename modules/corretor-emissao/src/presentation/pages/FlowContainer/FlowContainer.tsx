import { useParams } from 'react-router-dom';

export function FlowContainer() {
  const { id } = useParams<{ id?: string }>();

  return (
    <>
      <h1>Hello CorretorEmissao</h1>
      <span>{id}</span>
    </>
  );
}
