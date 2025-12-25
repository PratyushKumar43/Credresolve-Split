'use client'

import { Users, Briefcase, Plane, Home, GraduationCap } from 'lucide-react'

export default function Partners() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
      <h3 className="text-2xl font-medium mb-2">Trusted by Thousands</h3>
      <p className="text-neutral-500 mb-10 text-lg">
        Join students, roommates, travelers, and groups <br /> who split expenses with Credresolve
      </p>
      
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
        {/* Icons representing use cases */}
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center p-3">
          <Users className="w-6 h-6 text-neutral-600" />
        </div>
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center p-3">
          <Briefcase className="w-6 h-6 text-neutral-600" />
        </div>
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center p-3">
          <Plane className="w-6 h-6 text-neutral-600" />
        </div>
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center p-3">
          <Home className="w-6 h-6 text-neutral-600" />
        </div>
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center p-3">
          <GraduationCap className="w-6 h-6 text-neutral-600" />
        </div>
      </div>
    </section>
  )
}



