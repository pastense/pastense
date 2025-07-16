import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { authenticateWithGoogle } from '../api';

const Login = () => {
    const { login } = useAuth();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                // Send the Google credential to our backend for verification
                const response = await authenticateWithGoogle(credentialResponse.credential);

                if (response.access_token) {
                    login(response.access_token);
                }
            }
        } catch (error) {
            console.error('Authentication failed:', error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google authentication failed');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to PastTense</h1>
                        <p className="text-gray-600">Sign in to access your semantic search</p>
                    </div>

                    <div className="space-y-6">
                        <div className="text-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                auto_select
                                theme="outline"
                                size="large"
                                text="signin_with"
                                shape="rectangular"
                                width="100%"
                            />
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            <p>
                                Secure authentication powered by Google OAuth.
                                Your data remains private and secure.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center text-xs text-gray-400">
                            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 