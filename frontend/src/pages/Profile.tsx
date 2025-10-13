import Layout from '../components/Layout';

const Profile = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your profile settings and information.
          </p>
          
          <div className="mt-8 card">
            <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
            <p className="text-gray-600">Profile management interface coming soon!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;