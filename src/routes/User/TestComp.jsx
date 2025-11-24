import React from 'react'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Card from '../../components/Card'
import { useModal } from '../../components/Modal'

const TestUI = () => {
  const { openModal } = useModal()

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        <h1 className="text-4xl font-elegant font-bold text-center text-dark-900 dark:text-white">
          UI Kit Showcase
        </h1>

        {/* Buttons Section */}
        <Card>
          <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="primary" size="md">
              Primary Button
            </Button>
            <Button variant="secondary" size="md">
              Secondary Button
            </Button>
            <Button variant="outline" size="md">
              Outline Button
            </Button>
            <Button variant="ghost" size="md">
              Ghost Button
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </Card>

        {/* Inputs Section */}
        <Card>
          <h2 className="text-2xl font-semibold mb-6">Input Fields</h2>
          <div className="space-y-4 max-w-md">
            <Input 
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
            />
            <Input 
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <Input 
              label="With Error"
              type="text"
              placeholder="This field has an error"
              error="This field is required"
            />
          </div>
        </Card>

        {/* Modal Triggers */}
        <Card>
          <h2 className="text-2xl font-semibold mb-6">Modal Examples</h2>
          <div className="flex space-x-4">
            <Button 
              variant="primary"
              onClick={() => openModal('product-details', { isAdmin: false })}
            >
              User Product Modal
            </Button>
            <Button 
              variant="secondary"
              onClick={() => openModal('product-details', { isAdmin: true })}
            >
              Admin Product Modal
            </Button>
            <Button 
              variant="outline"
              onClick={() => openModal('login')}
            >
              Login Modal
            </Button>
          </div>
        </Card>

        {/* Card Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hover={true}>
            <h3 className="text-lg font-semibold mb-2">Hover Card</h3>
            <p className="text-dark-600 dark:text-dark-300">
              This card has hover effects. Perfect for product listings.
            </p>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-2">Static Card</h3>
            <p className="text-dark-600 dark:text-dark-300">
              This card doesn't have hover effects. Good for forms and content.
            </p>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

export default TestUI