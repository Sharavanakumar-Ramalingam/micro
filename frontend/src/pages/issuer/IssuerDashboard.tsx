import Layout from '../../components/Layout';

const IssuerDashboard = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Issuer Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage credentials, badge templates, and issuance activities.
          </p>
          
          <div className="mt-8 card">
            <h2 className="text-xl font-semibold mb-4">Issuer Control Panel</h2>
            <p className="text-gray-600">Issuer management interface coming soon!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IssuerDashboard;