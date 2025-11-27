import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      
<section className="w-full bg-gray-50">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center py-20 px-6">

    {/* LEFT — TEXT */}
    <div className="mt-2">
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-900 leading-tight">
        Welcome to Neighborhub
      </h1>

      <p className="text-cyan-900 text-md md:text-xl mt-4 max-w-md">
        A place where neighbors unite, support each other,  
        and build a connected & thriving community.
      </p>
    </div>

    {/* RIGHT — IMAGE */}
    <div className="w-full h-90 md:h-full">
      <img
        src="/images/ab1.jpg"
        alt="Community"
        className="w-full h-full object-cover rounded-xl shadow-xl"
      />
    </div>

  </div>
</section>


      {/* Our Story */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-cyan-900 mb-6">Our Story</h2>
        <p className="text-cyan-900 leading-relaxed text-lg">
          Neighborhub was created from a simple and powerful belief — that stronger communities
          begin with stronger connections. What started as a small initiative to help residents share
          information has grown into a vibrant digital space where people exchange ideas, support one
          another, discover helpful resources, and take part in shaping their neighborhood’s identity.
          <br /><br />
          Today, Neighborhood Connect continues to evolve, driven by our passion for unity and meaningful
          local engagement. Every story shared, every event organized, and every conversation started brings
          us closer to a kinder, safer, and more connected community.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 bg-gray-100 max-w-5xl mx-auto rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-cyan-900 mb-10 text-center">Mission & Vision</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-cyan-800 mb-4">Our Mission</h3>
            <p className="text-cyan-900">
              To empower local communities by providing a platform for communication, collaboration, and support,
              helping residents stay informed and engaged.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-cyan-800 mb-4">Our Vision</h3>
            <p className="text-cyan-900">
              To create connected, informed, and thriving neighborhoods where everyone has a voice and the tools
              to make a positive impact in their community.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-cyan-900 mb-10 text-center">Platform Benefits</h2>

        <div className=" text-cyan-900 grid md:grid-cols-3 gap-8">
          <div className="bg-white  p-6 rounded-lg shadow hover:shadow-xl transition text-center">
            <h3 className="text-xl font-semibold mb-2">Local Alerts</h3>
            <p className="text-cyan-900">Get timely announcements and alerts in your neighborhood.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition text-center">
            <h3 className="text-xl font-semibold mb-2">Events & Meetups</h3>
            <p className="text-cyn-900">Discover and participate in local events organized by the community.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition text-center">
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-cyan-900">Offer or request help and resources among your neighbors.</p>
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-150 to-gray-100 text-cyan-900 text-center">
        <h2 className="text-3xl font-bold mb-10">Community Impact</h2>

        <div className="  grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <div className=" shadow-md bg-white/10 backdrop-blur-md p-8 rounded-xl shadow">
            <p className="text-5xl font-bold text-cyan-900">1,500+</p>
            <p className="text-cyan-900 mt-2">Active Users</p>
          </div>

          <div className="shadow-md bg-white/10 backdrop-blur-md p-8 rounded-xl shadow">
            <p className="text-5xl font-bold text-cyan-900">4,200+</p>
            <p className="text-cyan-900 mt-2">Posts Shared</p>
          </div>

          <div className="shadow-md bg-white/10 backdrop-blur-md p-8 rounded-xl shadow">
            <p className="text-5xl font-bold text-cyan-900">180+</p>
            <p className="text-cyan-900 mt-2">Events Hosted</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
