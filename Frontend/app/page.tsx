import Navigation from '@/components/landing/Navigation'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Advantages from '@/components/landing/Advantages'
import Partners from '@/components/landing/Partners'
import DarkPulse from '@/components/landing/DarkPulse'
import RealTimeFeature from '@/components/landing/RealTimeFeature'
import GroupsFeature from '@/components/landing/GroupsFeature'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="w-full overflow-hidden">
      <Navigation />
      <Hero />
      <Features />
      <Advantages />
      <Partners />
      <DarkPulse />
      <RealTimeFeature />
      <GroupsFeature />
      <CTA />
      <Footer />
    </main>
  )
}



