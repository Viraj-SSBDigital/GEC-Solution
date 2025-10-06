import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { TokenWallet } from '../../components/TokenWallet';

export const GeneratorTokens = () => {
  const { tokens, generators } = useData();
  const { user } = useAuth();

  const generatorInfo = generators.find(g => g.name.includes(user?.name.split(' ')[0] || ''));
  const generatorTokens = generatorInfo ? tokens.filter(t => t.generatorId === generatorInfo.id) : [];

  return (
    <Layout>
      <TokenWallet tokens={generatorTokens} title="Generated Tokens" />
    </Layout>
  );
};
