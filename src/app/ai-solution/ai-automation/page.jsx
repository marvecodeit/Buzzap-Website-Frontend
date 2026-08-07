import React from 'react'
import './automation.css'
import { Cpu, BarChart3, Database, Workflow, ArrowRight } from 'lucide-react'

function Automation() {
  return (
    <section className="automation-section">
      {/* Background Ambience Elements */}
      <div className="automation-glow-core"></div>

      <div className="automation-container">
        
        {/* Top Header Split Grid Layout */}
        <div className="automation-header">
          <h2 className="automation-title">
            AI Systems That <span className="gradient-text">Never Sleep</span>
          </h2>
          <p className="automation-description">
            Our intelligent automation pipeline captures leads, qualifies them with AI, 
            updates your CRM, triggers personalized sequences, and tracks every 
            conversion — all automatically.
          </p>
        </div>

        {/* 3-Column Feature Cards System Grid */}
        <div className="automation-grid">
          
          {/* Card 1: Workflow Automation */}
          <div className="automation-card">
            <div className="card-visual-box workflow-box">
              <div className="mini-node-pipeline">
                <div className="node-item"><Database size={16} className="text-cyan" /></div>
                <div className="node-connector">=</div>
                <div className="node-item active-node"><Cpu size={16} className="text-blue" /></div>
                <div className="node-connector">=</div>
                <div className="node-item"><Workflow size={16} className="text-purple" /></div>
              </div>
            </div>
            <div className="card-info">
              <h3>Workflow Automation</h3>
              <p>
                Custom workflow builders connect your entire tech stack with 
                intelligent triggers and conditional logic.
              </p>
            </div>
          </div>

          {/* Card 2: AI CRM Dashboard */}
          <div className="automation-card">
            <div className="card-visual-box crm-box">
              <div className="crm-mock-header">
                <span className="crm-label">Leads Today</span>
                <span className="crm-metric text-cyan">+247</span>
              </div>
              
              {/* Dynamic Bar Charts */}
              <div className="crm-bar-chart">
                <div className="chart-bar" style={{ height: '35%' }}></div>
                <div className="chart-bar" style={{ height: '55%' }}></div>
                <div className="chart-bar" style={{ height: '40%' }}></div>
                <div className="chart-bar" style={{ height: '75%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
              </div>

              <div className="crm-mini-stats">
                <div className="stat-sub-card">
                  <span className="text-cyan">89%</span>
                  <label>Qualified</label>
                </div>
                <div className="stat-sub-card">
                  <span>156</span>
                  <label>Nurturing</label>
                </div>
                <div className="stat-sub-card">
                  <span className="text-purple">42</span>
                  <label>Closed</label>
                </div>
              </div>
            </div>
            <div className="card-info">
              <h3>AI CRM Dashboard</h3>
              <p>
                Real-time CRM insights with AI-powered lead scoring, pipeline health, 
                and conversion predictions.
              </p>
            </div>
          </div>

          {/* Card 3: Growth Analytics */}
          <div className="automation-card">
            <div className="card-visual-box analytics-box">
              <div className="live-status-tag">
                <span className="live-dot"></span>
                <span>Live</span>
              </div>
              <div className="analytics-graphic-wrap">
                <BarChart3 size={44} className="analytics-icon" />
              </div>
            </div>
            <div className="card-info">
              <h3>Growth Analytics</h3>
              <p>
                Comprehensive growth dashboards tracking every metric from first impressions 
                to precise automated revenue attribution.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Automation