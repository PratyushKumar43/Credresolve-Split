'use client'

import { Users, Home, Briefcase } from 'lucide-react'

export default function GroupsFeature() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32 flex flex-col-reverse md:flex-row items-center gap-16">
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
          Unlimited Groups <br /> & Members
        </h2>
        <p className="text-lg text-neutral-500 leading-relaxed mb-6">
          Create as many groups as you need - for roommates, trips, work expenses, or any shared costs. Add unlimited members to each group.
        </p>
        <p className="text-lg text-neutral-500 leading-relaxed">
          Organize your expenses the way that makes sense for you.
        </p>
        {/* Curly Line SVG connecting to next section */}
        <div className="mt-8 hidden md:block">
          <svg width="200" height="100" viewBox="0 0 200 100" fill="none" stroke="black" strokeWidth="1">
            <path d="M10,10 Q100,100 190,50"></path>
          </svg>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 relative h-[400px]">
        {/* Yellow Circle Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#ccf32f] rounded-full opacity-80"></div>
        
        {/* Floating Cards */}
        <div className="absolute top-10 left-10 bg-white p-3 rounded-xl shadow-lg flex items-center gap-3 w-48 animate-[bounce_3s_infinite]">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold">Weekend Trip</p>
            <p className="text-[10px] text-neutral-500">4 members</p>
          </div>
          <div className="ml-auto text-xs font-semibold">Rs 1,245</div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-xl shadow-lg flex items-center gap-3 w-56 z-10">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold">Roommates</p>
            <p className="text-[10px] text-neutral-500">5 members</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-semibold">Rs 2,450</p>
            <p className="text-[10px] text-green-500">Rs 320 owed</p>
          </div>
        </div>

        <div className="absolute bottom-20 right-10 bg-white p-3 rounded-xl shadow-lg flex items-center gap-3 w-48 animate-[bounce_4s_infinite]">
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold">Work Team</p>
            <p className="text-[10px] text-neutral-500">8 members</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-semibold">Rs 890</p>
            <p className="text-[10px] text-green-500">Rs 145 owed</p>
          </div>
        </div>
      </div>
    </section>
  )
}


