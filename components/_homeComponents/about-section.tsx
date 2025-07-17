"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Award, Globe, BookOpen, Lightbulb, Target, Heart } from "lucide-react"

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "World-class education with internationally recognized programs and faculty.",
      color: "text-blue-500",
    },
    {
      icon: Users,
      title: "Diverse Community",
      description: "A vibrant campus with students from all backgrounds and cultures.",
      color: "text-purple-500",
    },
    {
      icon: Award,
      title: "Research Innovation",
      description: "Cutting-edge research facilities and groundbreaking discoveries.",
      color: "text-green-500",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "International partnerships and exchange programs worldwide.",
      color: "text-orange-500",
    },
  ]

  const stats = [
    { icon: BookOpen, value: "200+", label: "Academic Programs", color: "bg-blue-500" },
    { icon: Users, value: "50,000+", label: "Students", color: "bg-purple-500" },
    { icon: GraduationCap, value: "15+", label: "Colleges", color: "bg-green-500" },
    { icon: Award, value: "100+", label: "Research Centers", color: "bg-orange-500" },
  ]

  return (
    <section id="about-section" className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Lightbulb className="w-4 h-4 mr-2" />
              About HNU
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Shaping Tomorrows
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Leaders Today
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              For over decades, Helwan National University has been at the forefront of higher education, fostering
              innovation, creativity, and excellence in every field of study.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Card className="text-center p-6 border-2 hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div
                      className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="p-8 h-full border-2 hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg bg-muted group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/5 to-purple-500/5 border-2 border-primary/10">
              <CardContent className="p-0">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                  To provide exceptional education, conduct groundbreaking research, and serve our community while
                  preparing students to become ethical leaders and global citizens who will shape the future.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Learn More About Our Vision
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
