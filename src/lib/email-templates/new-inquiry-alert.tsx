import React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  formType?: string
  fields?: { label: string; value: string }[]
}

const Email = ({ formType = 'Website inquiry', fields = [] }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New ${formType} on gearboxautos.in`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>GEARBOX AUTOS</Text>
        <Heading style={h1}>New {formType}</Heading>
        <Text style={muted}>A customer just submitted this on gearboxautos.in.</Text>
        <Hr style={hr} />
        {fields.map((f) => (
          <Section key={f.label} style={{ marginBottom: '10px' }}>
            <Text style={label}>{f.label}</Text>
            <Text style={value}>{f.value || '—'}</Text>
          </Section>
        ))}
        <Hr style={hr} />
        <Button href="https://gearboxautos.in/admin/lms" style={button}>Open LMS</Button>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `New ${d.formType ?? 'inquiry'}${d.name ? ` — ${d.name}` : ''}`,
  displayName: 'New inquiry alert (team)',
  to: 'arindam.banerjee@gearboxautos.in',
  previewData: {
    formType: 'Sell Lead',
    name: 'Rahul Kumar',
    fields: [
      { label: 'Name', value: 'Rahul Kumar' },
      { label: 'Phone', value: '+91 98765 43210' },
      { label: 'Car', value: 'Hyundai Creta 2021' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Montserrat, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const brand = { fontSize: '12px', letterSpacing: '3px', fontWeight: 700, color: '#111111', margin: 0 }
const h1 = { fontSize: '24px', color: '#111111', margin: '12px 0 4px' }
const muted = { fontSize: '14px', color: '#555555', margin: 0 }
const hr = { borderColor: '#e5e5e5', margin: '18px 0' }
const label = { fontSize: '11px', textTransform: 'uppercase' as const, color: '#777777', margin: 0 }
const value = { fontSize: '15px', color: '#111111', margin: '2px 0 0', whiteSpace: 'pre-wrap' as const }
const button = { backgroundColor: '#f5a400', color: '#111111', padding: '12px 20px', fontWeight: 700, textDecoration: 'none' }
