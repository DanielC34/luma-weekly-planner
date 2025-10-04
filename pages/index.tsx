import React from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Luma - Stay organized effortlessly</title>
        <meta
          name="description"
          content="AI-powered weekly planner that helps you organize tasks and create optimal schedules effortlessly."
        />
      </Head>
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Luma</h1>
            <p className="text-xl text-gray-600 mb-8">
              Stay organized effortlessly.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;