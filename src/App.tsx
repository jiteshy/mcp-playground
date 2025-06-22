interface AppProps {}

function App({}: AppProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MCP Playground
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            React 18 + Vite + Tailwind CSS
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
            Ready to build! 🚀
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
