import { useState } from 'react'
import {
  Text,
  Heading,
  Button,
  Badge,
  Card, CardHeader, CardBody,
  Chip,
  TextField,
  TextArea,
  Spinner,
  Skeleton,
  Avatar,
  Progress,
  Callout,
  Dialog,
  Toast,
  Tabs,
  Table,
  SelectTrigger,
  Checkbox,
} from '../components/ds'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--space-10)' }}>
      <div style={{
        borderBottom: '2px solid var(--brand)',
        paddingBottom: 'var(--space-2)',
        marginBottom: 'var(--space-5)',
      }}>
        <Heading as="h2" size="2xl" weight="bold">{title}</Heading>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {children}
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Text as="p" size="xs" color="tertiary" style={{ marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  )
}

export default function DSGalleryScreen() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('one')
  const [checked, setChecked] = useState(false)
  const [selectVal, setSelectVal] = useState('')
  const [textVal, setTextVal] = useState('')

  return (
    <div style={{
      padding: 'var(--space-8)',
      maxWidth: 900,
      margin: '0 auto',
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-10)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--border)' }}>
        <Heading as="h1" size="4xl" weight="bold" style={{ marginBottom: 'var(--space-2)' }}>
          Design System Gallery
        </Heading>
        <Text as="p" size="sm" color="secondary">
          Route: /_ds — All DS primitives rendered for visual review.
        </Text>
      </div>

      {/* ── Text ─────────────────────────────── */}
      <Section title="Text">
        <Row label="Sizes">
          <Text size="xs">xs — 12px</Text>
          <Text size="sm">sm — 13px</Text>
          <Text size="base">base — 14px</Text>
          <Text size="md">md — 15px</Text>
          <Text size="lg">lg — 16px</Text>
          <Text size="xl">xl — 18px</Text>
          <Text size="2xl">2xl — 20px</Text>
          <Text size="3xl">3xl — 24px</Text>
        </Row>
        <Row label="Weights">
          <Text weight="normal">Normal</Text>
          <Text weight="medium">Medium</Text>
          <Text weight="semibold">Semibold</Text>
          <Text weight="bold">Bold</Text>
        </Row>
        <Row label="Colors">
          <Text color="primary">Primary</Text>
          <Text color="secondary">Secondary</Text>
          <Text color="tertiary">Tertiary</Text>
          <Text color="disabled">Disabled</Text>
          <Text color="brand">Brand</Text>
          <Text color="error">Error</Text>
        </Row>
      </Section>

      {/* ── Heading ──────────────────────────── */}
      <Section title="Heading">
        <Row label="Sizes">
          <Heading size="2xl">2xl Heading</Heading>
          <Heading size="3xl">3xl Heading</Heading>
          <Heading size="4xl">4xl Heading</Heading>
          <Heading size="5xl">5xl Heading</Heading>
        </Row>
        <Row label="Weights">
          <Heading weight="medium">Medium</Heading>
          <Heading weight="semibold">Semibold</Heading>
          <Heading weight="bold">Bold</Heading>
        </Row>
      </Section>

      {/* ── Button ───────────────────────────── */}
      <Section title="Button">
        <Row label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger-ghost">Danger Ghost</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="States">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </Row>
      </Section>

      {/* ── Badge ────────────────────────────── */}
      <Section title="Badge">
        <Row label="Variants">
          <Badge variant="active">Active</Badge>
          <Badge variant="draft">Draft</Badge>
          <Badge variant="inactive">Inactive</Badge>
          <Badge variant="urgent">Urgent</Badge>
          <Badge variant="resolved">Resolved</Badge>
          <Badge variant="passive">Passive</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="brand">Brand</Badge>
        </Row>
        <Row label="Sizes">
          <Badge size="sm" variant="active">Active SM</Badge>
          <Badge size="md" variant="active">Active MD</Badge>
        </Row>
      </Section>

      {/* ── Chip ─────────────────────────────── */}
      <Section title="Chip">
        <Row label="Default / Active">
          <Chip label="Full-time" />
          <Chip label="Remote" active />
          <Chip label="Engineering" />
          <Chip label="Design" active />
        </Row>
        <Row label="Sizes">
          <Chip label="Small" size="sm" />
          <Chip label="Medium" size="md" />
        </Row>
      </Section>

      {/* ── Avatar ───────────────────────────── */}
      <Section title="Avatar">
        <Row label="Sizes">
          <Avatar initials="SM" size="sm" />
          <Avatar initials="MD" size="md" />
          <Avatar initials="LG" size="lg" />
        </Row>
        <Row label="Colors">
          <Avatar initials="BR" color="brand" />
          <Avatar initials="SC" color="secondary" />
        </Row>
      </Section>

      {/* ── Spinner ──────────────────────────── */}
      <Section title="Spinner">
        <Row label="Sizes">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
        <Row label="Colors">
          <Spinner color="brand" />
          <div style={{ background: 'var(--brand)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', display: 'flex' }}>
            <Spinner color="white" />
          </div>
          <Spinner color="secondary" />
        </Row>
      </Section>

      {/* ── Skeleton ─────────────────────────── */}
      <Section title="Skeleton">
        <Row label="Lines">
          <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Skeleton height={20} width="80%" />
            <Skeleton height={14} width="60%" />
            <Skeleton height={14} width="70%" />
          </div>
        </Row>
        <Row label="Rounded (avatar)">
          <Skeleton width={40} height={40} rounded />
          <Skeleton width={32} height={32} rounded />
          <Skeleton width={24} height={24} rounded />
        </Row>
      </Section>

      {/* ── Progress ─────────────────────────── */}
      <Section title="Progress">
        <Row label="With label + value">
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Progress value={88} label="Match Score" showValue />
            <Progress value={62} label="Communication" showValue />
            <Progress value={45} label="Technical Fit" showValue />
          </div>
        </Row>
        <Row label="Colors">
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Progress value={80} color="brand" showValue />
            <Progress value={50} color="warning" showValue />
            <Progress value={20} color="error" showValue />
          </div>
        </Row>
      </Section>

      {/* ── Callout ──────────────────────────── */}
      <Section title="Callout">
        <Callout variant="info">This is an informational callout with some context for the user.</Callout>
        <Callout variant="success">Your application was submitted successfully.</Callout>
        <Callout variant="warning">Your session will expire in 5 minutes.</Callout>
        <Callout variant="error">Something went wrong. Please try again.</Callout>
      </Section>

      {/* ── Card ─────────────────────────────── */}
      <Section title="Card">
        <Row label="Padding variants">
          <Card padding="none" style={{ width: 180, border: '1px solid var(--border)' }}>
            <CardHeader><Text size="sm" weight="semibold">No Padding</Text></CardHeader>
            <CardBody><Text size="xs" color="secondary">Card body content</Text></CardBody>
          </Card>
          <Card padding="sm" style={{ width: 180 }}>
            <CardHeader><Text size="sm" weight="semibold">Small Padding</Text></CardHeader>
            <CardBody><Text size="xs" color="secondary">Card body content</Text></CardBody>
          </Card>
          <Card padding="md" style={{ width: 180 }}>
            <CardHeader><Text size="sm" weight="semibold">Medium Padding</Text></CardHeader>
            <CardBody><Text size="xs" color="secondary">Card body content</Text></CardBody>
          </Card>
        </Row>
        <Row label="Hoverable">
          <Card hoverable padding="md" style={{ width: 220, cursor: 'pointer' }}>
            <CardHeader><Text size="sm" weight="semibold">Hoverable Card</Text></CardHeader>
            <CardBody><Text size="xs" color="secondary">Hover to see lift effect</Text></CardBody>
          </Card>
        </Row>
      </Section>

      {/* ── TextField ────────────────────────── */}
      <Section title="TextField">
        <Row label="Default">
          <TextField
            label="Job Title"
            placeholder="e.g. Senior Frontend Engineer"
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            style={{ width: 280 }}
          />
        </Row>
        <Row label="With error">
          <TextField
            label="Email"
            placeholder="you@example.com"
            error="Please enter a valid email address"
            style={{ width: 280 }}
          />
        </Row>
        <Row label="Disabled">
          <TextField
            label="Locked field"
            value="Cannot edit this"
            disabled
            style={{ width: 280 }}
          />
        </Row>
      </Section>

      {/* ── TextArea ─────────────────────────── */}
      <Section title="TextArea">
        <Row label="Default">
          <TextArea
            label="Cover Letter"
            placeholder="Tell us why you're a great fit…"
            rows={4}
            style={{ width: 360 }}
          />
        </Row>
        <Row label="With error">
          <TextArea
            label="Message"
            error="Message cannot be empty"
            rows={3}
            style={{ width: 360 }}
          />
        </Row>
      </Section>

      {/* ── SelectTrigger ────────────────────── */}
      <Section title="SelectTrigger">
        <Row label="Default">
          <SelectTrigger
            label="Experience Level"
            placeholder="Select level"
            value={selectVal}
            onChange={(e) => setSelectVal(e.target.value)}
            options={[
              { value: 'junior', label: 'Junior (0–2 yrs)' },
              { value: 'mid', label: 'Mid (2–5 yrs)' },
              { value: 'senior', label: 'Senior (5+ yrs)' },
            ]}
            style={{ width: 240 }}
          />
        </Row>
        <Row label="With error">
          <SelectTrigger
            label="Department"
            placeholder="Choose department"
            options={[{ value: 'eng', label: 'Engineering' }]}
            error="Please select a department"
            style={{ width: 240 }}
          />
        </Row>
      </Section>

      {/* ── Checkbox ─────────────────────────── */}
      <Section title="Checkbox">
        <Row label="States">
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            label="I agree to the terms and conditions"
          />
          <Checkbox checked={true} onChange={() => {}} label="Pre-checked" />
          <Checkbox checked={false} onChange={() => {}} label="Disabled unchecked" disabled />
          <Checkbox checked={true} onChange={() => {}} label="Disabled checked" disabled />
        </Row>
      </Section>

      {/* ── Tabs ─────────────────────────────── */}
      <Section title="Tabs">
        <Tabs
          tabs={[
            { key: 'one', label: 'Overview' },
            { key: 'two', label: 'Assessments' },
            { key: 'three', label: 'Timeline' },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        >
          <Text size="sm" color="secondary">
            {activeTab === 'one' && 'Overview tab content'}
            {activeTab === 'two' && 'Assessments tab content'}
            {activeTab === 'three' && 'Timeline tab content'}
          </Text>
        </Tabs>
      </Section>

      {/* ── Table ────────────────────────────── */}
      <Section title="Table">
        <Table
          columns={[
            { key: 'name', label: 'Candidate' },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status' },
            { key: 'score', label: 'Match' },
          ]}
          rows={[
            { name: 'Ahmad Azza', role: 'Frontend Engineer', status: <Badge variant="active">Active</Badge>, score: '88%' },
            { name: 'Sarah Kim', role: 'Product Designer', status: <Badge variant="urgent">Pending</Badge>, score: '74%' },
            { name: 'James Obi', role: 'Backend Engineer', status: <Badge variant="passive">Draft</Badge>, score: '61%' },
          ]}
        />
      </Section>

      {/* ── Dialog ───────────────────────────── */}
      <Section title="Dialog">
        <Row label="Trigger">
          <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
        </Row>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Confirm Action"
          footer={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setDialogOpen(false)}>Confirm</Button>
            </>
          }
        >
          <Text as="p" size="sm" color="secondary">
            Are you sure you want to proceed? This action will submit your application to the recruiter.
          </Text>
        </Dialog>
      </Section>

      {/* ── Toast ────────────────────────────── */}
      <Section title="Toast">
        <Row label="Note">
          <Text size="sm" color="secondary">
            Toasts are rendered via <code style={{ fontFamily: 'monospace', background: 'var(--page-bg)', padding: '2px 6px', borderRadius: 4 }}>ToastProvider</code> in the app root. Use <code style={{ fontFamily: 'monospace', background: 'var(--page-bg)', padding: '2px 6px', borderRadius: 4 }}>useToast().showToast()</code> to trigger them.
          </Text>
        </Row>
        <Row label="Standalone component preview">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: 320 }}>
            <Toast message="Your profile was updated." variant="success" duration={0} onDismiss={() => {}} />
            <Toast message="This feature is coming in V1." variant="info" duration={0} onDismiss={() => {}} />
            <Toast message="Failed to load applications." variant="error" duration={0} onDismiss={() => {}} />
          </div>
        </Row>
      </Section>

      {/* Footer */}
      <div style={{ paddingTop: 'var(--space-8)', borderTop: '1px solid var(--border)', marginTop: 'var(--space-4)' }}>
        <Text size="xs" color="tertiary">Claro Design System — /_ds gallery — dev only</Text>
      </div>
    </div>
  )
}
