// components/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { ProjectContext } from '../contexts/ProjectContext';
import Footer from './Footer';
import ChartCard from './ChartCard';
import { ChartService } from '../utils/ChartService';
import {
    Container,
    Grid,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Popover
} from '@mui/material';
import ProjectInfo from './ProjectInfo';
import Header from './Header';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// 计算代码质量与可维护性评分
const calculateCodeQualityScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let score = 0;
        let metrics = 0;

        // 1. PR 质量趋势 (权重：40)
        if (data.change_requests?.length >= 2 && data.change_requests_accepted?.length >= 2) {
            const recentPRs = data.change_requests.slice(-6);
            const recentAccepted = data.change_requests_accepted.slice(-6);
            
            // 计算接受率趋势
            const startRate = recentAccepted[0].value / recentPRs[0].value;
            const endRate = recentAccepted[recentAccepted.length - 1].value / recentPRs[recentPRs.length - 1].value;
            const rateChange = endRate - startRate;
            
            // 趋势得分：接受率提升得分（不设上限）
            const trendScore = Math.max(rateChange * 150, 0);
            // 当前水平得分：当前接受率得分（不设上限）
            const levelScore = endRate * 100;
            
            score += (trendScore + levelScore) * 0.4; // 权重40%
            metrics++;
        }

        // 2. 代码审查效率趋势 (权重：30)
        if (data.change_request_resolution_duration?.length >= 2) {
            const recentDurations = data.change_request_resolution_duration.slice(-6);
            const values = recentDurations.map(item => item.value);
            
            // 计算处理时间趋势（是否在改善）
            const trendImprovement = values.slice(1).reduce((acc, curr, idx) => {
                return acc + (values[idx] - curr) / values[idx];
            }, 0) / (values.length - 1);
            
            // 计算平均处理时间（小时）
            const avgDuration = values.reduce((a, b) => a + b, 0) / values.length / 60;
            
            // 趋势得分：改善趋势得分（不设上限）
            const trendScore = Math.max(trendImprovement * 200, 0);
            // 速度得分：处理时间越短得分越高（使用指数衰减）
            const speedScore = 100 * Math.exp(-avgDuration / (7 * 24));
            
            score += (trendScore + speedScore) * 0.3; // 权重30%
            metrics++;
        }

        // 3. Issue 解决质量趋势 (权重：30)
        if (data.issue_resolution_duration?.length >= 2) {
            const recentDurations = data.issue_resolution_duration.slice(-6);
            const values = recentDurations.map(item => item.value);
            
            // 计算解决时间趋势
            const trendImprovement = values.slice(1).reduce((acc, curr, idx) => {
                return acc + (values[idx] - curr) / values[idx];
            }, 0) / (values.length - 1);
            
            // 计算平均解决时间（小时）
            const avgDuration = values.reduce((a, b) => a + b, 0) / values.length / 60;
            
            // 趋势得分：改善趋势得分（不设上限）
            const trendScore = Math.max(trendImprovement * 200, 0);
            // 速度得分：解决时间越短得分越高（使用指数衰减）
            const speedScore = 100 * Math.exp(-avgDuration / (14 * 24));
            
            score += (trendScore + speedScore) * 0.3; // 权重30%
            metrics++;
        }

        if (metrics > 0) {
            totalScore += score;
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

// 计算社区活跃度评分
const calculateCommunityScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let score = 0;
        let metrics = 0;

        // 1. 贡献者多样性趋势 (40分)
        if (data.bus_factor?.length >= 2) {
            const recentBusFactor = data.bus_factor.slice(-6);
            const startValue = recentBusFactor[0].value;
            const endValue = recentBusFactor[recentBusFactor.length - 1].value;
            const growthRate = (endValue - startValue) / startValue;
            
            // 计算趋势得分：增长率为正得高分，下降得低分
            const trendScore = Math.min(Math.max(growthRate * 100, -20), 20); // 增长率转换为-20到20的分数
            // 当前水平得分：当前值越高得分越高
            const levelScore = Math.min(endValue * 4, 20); // 当前水平最高20分
            
            score += trendScore + levelScore;
            metrics++;
        }

        // 2. 新贡献者增长趋势 (30分)
        if (data.new_contributors?.length >= 2) {
            const recentContributors = data.new_contributors.slice(-6);
            const values = recentContributors.map(item => item.value);
            
            // 计算增长趋势
            const growthTrend = values.slice(1).reduce((acc, curr, idx) => {
                return acc + (curr - values[idx]) / values[idx];
            }, 0) / (values.length - 1);
            
            // 计算平均贡献者数量
            const avgContributors = values.reduce((a, b) => a + b, 0) / values.length;
            
            // 趋势得分：正增长得高分
            const trendScore = Math.min(Math.max(growthTrend * 60, 0), 15);
            // 规模得分：平均贡献者数量越多得分越高
            const scaleScore = Math.min(avgContributors * 3, 15);
            
            score += trendScore + scaleScore;
            metrics++;
        }

        // 3. 社区响应活跃度 (30分)
        if (data.issue_response_time?.length >= 2) {
            const recentResponseTime = data.issue_response_time.slice(-6);
            const values = recentResponseTime.map(item => item.value);
            
            // 计算响应时间趋势（是否在改善）
            const trendImprovement = values.slice(1).reduce((acc, curr, idx) => {
                return acc + (values[idx] - curr) / values[idx]; // 响应时间减少是好事
            }, 0) / (values.length - 1);
            
            // 计算平均响应时间（小时）
            const avgResponseTime = values.reduce((a, b) => a + b, 0) / values.length / 60;
            
            // 趋势得分：改善趋势得高分
            const trendScore = Math.min(Math.max(trendImprovement * 60, 0), 15);
            // 响应速度得分：平均响应时间越短得分越高
            const speedScore = Math.min(Math.max(15 * (1 - avgResponseTime / 72), 0), 15); // 3天内递减计分
            
            score += trendScore + speedScore;
            metrics++;
        }

        if (metrics > 0) {
            totalScore += score;
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

// 计算项目影响力评分
const calculateImpactScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let score = 0;
        let metrics = 0;

        // 1. Stars 增长趋势 (40分)
        if (data.stars?.length >= 2) {
            const recentStars = data.stars.slice(-6);
            const values = recentStars.map(item => item.value);
            
            // 计算增长趋势
            const growthRate = (values[values.length - 1] - values[0]) / values[0];
            // 计算月均增长率
            const monthlyGrowth = values.slice(1).reduce((acc, curr, idx) => {
                return acc + (curr - values[idx]) / values[idx];
            }, 0) / (values.length - 1);
            
            // 趋势得分：持续增长得高分
            const trendScore = Math.min(Math.max(monthlyGrowth * 120, 0), 20);
            // 规模得分：总增长率越高得分越高
            const scaleScore = Math.min(Math.max(growthRate * 80, 0), 20);
            
            score += trendScore + scaleScore;
            metrics++;
        }

        // 2. 技术影响力趋势 (30分)
        if (data.attention?.length >= 2) {
            const recentAttention = data.attention.slice(-6);
            const values = recentAttention.map(item => item.value);
            
            // 计算增长趋势
            const growthRate = (values[values.length - 1] - values[0]) / values[0];
            // 计算月均增长率
            const monthlyGrowth = values.slice(1).reduce((acc, curr, idx) => {
                return acc + (curr - values[idx]) / values[idx];
            }, 0) / (values.length - 1);
            
            // 趋势得分：持续增长得高分
            const trendScore = Math.min(Math.max(monthlyGrowth * 90, 0), 15);
            // 规模得分：总增长率越高得分越高
            const scaleScore = Math.min(Math.max(growthRate * 60, 0), 15);
            
            score += trendScore + scaleScore;
            metrics++;
        }

        // 3. Fork 应用趋势 (30分)
        if (data.technical_fork?.length >= 2) {
            const recentForks = data.technical_fork.slice(-6);
            const values = recentForks.map(item => item.value);
            
            // 计算增长趋势
            const growthRate = (values[values.length - 1] - values[0]) / values[0];
            // 当前转化率
            const currentRate = values[values.length - 1];
            
            // 趋势得分：增长趋势得高分
            const trendScore = Math.min(Math.max(growthRate * 60, 0), 15);
            // 当前水平得分：当前转化率越高得分越高
            const levelScore = Math.min(currentRate * 30, 15);
            
            score += trendScore + levelScore;
            metrics++;
        }

        if (metrics > 0) {
            totalScore += score;
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

// 计算项目维护评分
const calculateMaintenanceScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data?.activity?.length) return;

        let score = 0;
        let metrics = 0;

        // 1. 维护频率趋势 (40分)
        if (data.activity.length >= 2) {
            const recentActivity = data.activity.slice(-6);
            const values = recentActivity.map(item => item.value);
            
            // 计算活动趋势
            const growthRate = (values[values.length - 1] - values[0]) / values[0];
            // 当前活动水平
            const currentLevel = values[values.length - 1];
            
            // 趋势得分：活动增长趋势得高分
            const trendScore = Math.min(Math.max(growthRate * 80, 0), 20);
            // 当前水平得分：当前活动水平越高得分越高
            const levelScore = Math.min(currentLevel * 4, 20);
            
            score += trendScore + levelScore;
            metrics++;
        }

        // 2. 维护稳定性 (30分)
        if (data.activity.length >= 2) {
            const recentActivity = data.activity.slice(-6);
            const values = recentActivity.map(item => item.value);
            
            // 计算活动波动
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
            const cv = Math.sqrt(variance) / mean; // 变异系数
            
            // 波动趋势：计算波动是否在减小
            const halfLength = Math.floor(values.length / 2);
            const firstHalfVariance = values.slice(0, halfLength).reduce((a, b) => a + Math.pow(b - mean, 2), 0) / halfLength;
            const secondHalfVariance = values.slice(halfLength).reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length - halfLength);
            const varianceImprovement = (firstHalfVariance - secondHalfVariance) / firstHalfVariance;
            
            // 趋势得分：波动减小趋势得高分
            const trendScore = Math.min(Math.max(varianceImprovement * 60, 0), 15);
            // 稳定性得分：变异系数越小得分越高
            const stabilityScore = Math.min(Math.max(15 * (1 - cv), 0), 15);
            
            score += trendScore + stabilityScore;
            metrics++;
        }

        // 3. 维护持续性 (30分)
        if (data.activity.length >= 2) {
            const recentActivity = data.activity.slice(-6);
            const values = recentActivity.map(item => item.value);
            
            // 计算连续性
            let gaps = 0;
            for (let i = 1; i < values.length; i++) {
                if (values[i] < values[i-1] * 0.5) gaps++; // 活动量降低超过50%算作gap
            }
            
            // 计算活动量的整体趋势
            const growthRate = (values[values.length - 1] - values[0]) / values[0];
            
            // 趋势得分：整体增长趋势得高分
            const trendScore = Math.min(Math.max(growthRate * 60, 0), 15);
            // 连续性得分：gap越少得分越高
            const continuityScore = Math.min(Math.max(15 * (1 - gaps / values.length), 0), 15);
            
            score += trendScore + continuityScore;
            metrics++;
        }

        if (metrics > 0) {
            totalScore += score;
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

const getDetailedScoreExplanation = (type, projectsData) => {
    // 检查数据是否存在
    if (!projectsData || Object.keys(projectsData).length === 0) {
        return '数据加载中...';
    }

    let explanation = '';
    const data = Object.values(projectsData)[0]; // 获取第一个项目的数据
    
    // 检查数据是否有效
    if (!data) {
        return '暂无数据';
    }

    const totalScore = type === 'codeQuality' ? calculateCodeQualityScore(projectsData) :
                      type === 'community' ? calculateCommunityScore(projectsData) :
                      type === 'impact' ? calculateImpactScore(projectsData) :
                      type === 'maintenance' ? calculateMaintenanceScore(projectsData) : 0;

    switch (type) {
        case 'codeQuality':
            explanation = '代码质量与可维护性评分算法：\n\n';
            
            if (data.change_requests?.length >= 2 && data.change_requests_accepted?.length >= 2) {
                const recentPRs = data.change_requests.slice(-6);
                const recentAccepted = data.change_requests_accepted.slice(-6);
                const startRate = recentAccepted[0].value / recentPRs[0].value;
                const endRate = recentAccepted[recentAccepted.length - 1].value / recentPRs[recentPRs.length - 1].value;
                const rateChange = endRate - startRate;
                const trendScore = Math.max(rateChange * 150, 0);
                const levelScore = endRate * 100;
                
                explanation += `• PR质量 (权重40%)：
  - 当前接受率：${(endRate * 100).toFixed(1)}%
  - 接受率变化：${(rateChange * 100).toFixed(1)}%
  - 评分说明：改善趋势(${Math.round(trendScore)}) + 当前水平(${Math.round(levelScore)})
  - 加权得分：${Math.round((trendScore + levelScore) * 0.4)}\n\n`;
            }
            
            if (data.change_request_resolution_duration?.length >= 2) {
                const recentDurations = data.change_request_resolution_duration.slice(-6);
                const values = recentDurations.map(item => item.value);
                const trendImprovement = values.slice(1).reduce((acc, curr, idx) => {
                    return acc + (values[idx] - curr) / values[idx];
                }, 0) / (values.length - 1);
                const avgDuration = values.reduce((a, b) => a + b, 0) / values.length / 60;
                const trendScore = Math.max(trendImprovement * 200, 0);
                const speedScore = 100 * Math.exp(-avgDuration / (7 * 24));
                
                explanation += `• 代码审查效率 (权重30%)：
  - 平均处理时间：${avgDuration.toFixed(1)}小时
  - 处理速度改善：${(trendImprovement * 100).toFixed(1)}%
  - 评分说明：改善趋势(${Math.round(trendScore)}) + 速度得分(${Math.round(speedScore)})
  - 加权得分：${Math.round((trendScore + speedScore) * 0.3)}\n\n`;
            }
            
            if (data.issue_resolution_duration?.length >= 2) {
                const recentDurations = data.issue_resolution_duration.slice(-6);
                const values = recentDurations.map(item => item.value);
                const trendImprovement = values.slice(1).reduce((acc, curr, idx) => {
                    return acc + (values[idx] - curr) / values[idx];
                }, 0) / (values.length - 1);
                const avgDuration = values.reduce((a, b) => a + b, 0) / values.length / 60;
                const trendScore = Math.max(trendImprovement * 200, 0);
                const speedScore = 100 * Math.exp(-avgDuration / (14 * 24));
                
                explanation += `• Issue解决质量 (权重30%)：
  - 平均解决时间：${avgDuration.toFixed(1)}小时
  - 解决速度改善：${(trendImprovement * 100).toFixed(1)}%
  - 评分说明：改善趋势(${Math.round(trendScore)}) + 速度得分(${Math.round(speedScore)})
  - 加权得分：${Math.round((trendScore + speedScore) * 0.3)}\n\n`;
            }
            
            explanation += `总分：${totalScore}`;
            break;

        case 'community':
            explanation = '社区活跃度与贡献评分算法：\n\n';
            
            if (data.bus_factor?.length >= 2) {
                const recentBusFactor = data.bus_factor.slice(-6);
                const startValue = recentBusFactor[0].value;
                const endValue = recentBusFactor[recentBusFactor.length - 1].value;
                const growthRate = (endValue - startValue) / startValue;
                const trendScore = Math.min(Math.max(growthRate * 100, -20), 20);
                const levelScore = Math.min(endValue * 4, 20);
                
                explanation += `• 贡献者多样性 (权重40%)：
  - 当前 Bus Factor：${endValue.toFixed(2)}
  - 6个月增长率：${(growthRate * 100).toFixed(1)}%
  - 评分说明：增长趋势(${Math.round(trendScore)}) + 当前水平(${Math.round(levelScore)})
  - 总得分：${Math.round(trendScore + levelScore)}\n\n`;
            }
            
            if (data.new_contributors?.length >= 2) {
                const recentContributors = data.new_contributors.slice(-6);
                const values = recentContributors.map(item => item.value);
                const growthTrend = values.slice(1).reduce((acc, curr, idx) => {
                    return acc + (curr - values[idx]) / values[idx];
                }, 0) / (values.length - 1);
                const avgContributors = values.reduce((a, b) => a + b, 0) / values.length;
                const trendScore = Math.min(Math.max(growthTrend * 60, -15), 15);
                const scaleScore = Math.min(avgContributors * 3, 15);
                
                explanation += `• 新贡献者增长 (权重30%)：
  - 月均新增：${avgContributors.toFixed(1)}人
  - 增长趋势：${(growthTrend * 100).toFixed(1)}%
  - 评分说明：增长趋势(${Math.round(trendScore)}) + 规模水平(${Math.round(scaleScore)})
  - 总得分：${Math.round(trendScore + scaleScore)}\n\n`;
            }
            
            if (data.issue_response_time?.length >= 2) {
                const recentResponseTime = data.issue_response_time.slice(-6);
                const values = recentResponseTime.map(item => item.value);
                const trendImprovement = values.slice(1).reduce((acc, curr, idx) => {
                    return acc + (values[idx] - curr) / values[idx];
                }, 0) / (values.length - 1);
                const avgResponseTime = values.reduce((a, b) => a + b, 0) / values.length / 60;
                const trendScore = Math.min(Math.max(trendImprovement * 60, -15), 15);
                const speedScore = Math.min(Math.max(15 * (1 - avgResponseTime / 72), -15), 15);
                
                explanation += `• 社区响应活跃度 (权重30%)：
  - 平均响应时间：${avgResponseTime.toFixed(1)}小时
  - 响应改善趋势：${(trendImprovement * 100).toFixed(1)}%
  - 评分说明：改善趋势(${Math.round(trendScore)}) + 响应速度(${Math.round(speedScore)})
  - 总得分：${Math.round(trendScore + speedScore)}\n\n`;
            }
            
            explanation += `总分：${totalScore}`;
            break;

        case 'impact':
            explanation = '项目影响力与应用评分算法：\n\n';
            
            if (data.stars?.length >= 2) {
                const recentStars = data.stars.slice(-6);
                const values = recentStars.map(item => item.value);
                const growthRate = (values[values.length - 1] - values[0]) / values[0];
                const monthlyGrowth = values.slice(1).reduce((acc, curr, idx) => {
                    return acc + (curr - values[idx]) / values[idx];
                }, 0) / (values.length - 1);
                const trendScore = Math.min(Math.max(monthlyGrowth * 120, -20), 20);
                const scaleScore = Math.min(Math.max(growthRate * 80, -20), 20);
                
                explanation += `• Stars增长 (权重40%)：
  - 总增长率：${(growthRate * 100).toFixed(1)}%
  - 月均增长率：${(monthlyGrowth * 100).toFixed(1)}%
  - 评分说明：月度趋势(${Math.round(trendScore)}) + 总体增长(${Math.round(scaleScore)})
  - 总得分：${Math.round(trendScore + scaleScore)}\n\n`;
            }
            
            if (data.attention?.length >= 2) {
                const recentAttention = data.attention.slice(-6);
                const values = recentAttention.map(item => item.value);
                const growthRate = (values[values.length - 1] - values[0]) / values[0];
                const monthlyGrowth = values.slice(1).reduce((acc, curr, idx) => {
                    return acc + (curr - values[idx]) / values[idx];
                }, 0) / (values.length - 1);
                const trendScore = Math.min(Math.max(monthlyGrowth * 90, -15), 15);
                const scaleScore = Math.min(Math.max(growthRate * 60, -15), 15);
                
                explanation += `• 技术影响力 (权重30%)：
  - 总增长率：${(growthRate * 100).toFixed(1)}%
  - 月均增长率：${(monthlyGrowth * 100).toFixed(1)}%
  - 评分说明：月度趋势(${Math.round(trendScore)}) + 总体增长(${Math.round(scaleScore)})
  - 总得分：${Math.round(trendScore + scaleScore)}\n\n`;
            }
            
            if (data.technical_fork?.length >= 2) {
                const recentForks = data.technical_fork.slice(-6);
                const values = recentForks.map(item => item.value);
                const growthRate = (values[values.length - 1] - values[0]) / values[0];
                const currentRate = values[values.length - 1];
                const trendScore = Math.min(Math.max(growthRate * 60, -15), 15);
                const levelScore = Math.min(Math.max(currentRate * 30, -15), 15);
                
                explanation += `• Fork应用趋势 (权重30%)：
  - 当前转化率：${(currentRate * 100).toFixed(2)}%
  - 增长趋势：${(growthRate * 100).toFixed(1)}%
  - 评分说明：增长趋势(${Math.round(trendScore)}) + 当前水平(${Math.round(levelScore)})
  - 总得分：${Math.round(trendScore + levelScore)}\n\n`;
            }
            
            explanation += `总分：${totalScore}`;
            break;

        case 'maintenance':
            explanation = '项目维护与更新评分算法：\n\n';
            
            if (data.activity?.length >= 2) {
                const recentActivity = data.activity.slice(-6);
                const values = recentActivity.map(item => item.value);
                const growthRate = (values[values.length - 1] - values[0]) / values[0];
                const currentLevel = values[values.length - 1];
                const trendScore = Math.min(Math.max(growthRate * 80, -20), 20);
                const levelScore = Math.min(Math.max(currentLevel * 4, -20), 20);
                
                explanation += `• 维护频率 (权重40%)：
  - 当前活动水平：${currentLevel.toFixed(1)}
  - 活动增长率：${(growthRate * 100).toFixed(1)}%
  - 评分说明：增长趋势(${Math.round(trendScore)}) + 当前水平(${Math.round(levelScore)})
  - 总得分：${Math.round(trendScore + levelScore)}\n\n`;
            }
            
            if (data.activity?.length >= 2) {
                const recentActivity = data.activity.slice(-6);
                const values = recentActivity.map(item => item.value);
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
                const cv = Math.sqrt(variance) / mean;
                const halfLength = Math.floor(values.length / 2);
                const firstHalfVariance = values.slice(0, halfLength).reduce((a, b) => a + Math.pow(b - mean, 2), 0) / halfLength;
                const secondHalfVariance = values.slice(halfLength).reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length - halfLength);
                const varianceImprovement = (firstHalfVariance - secondHalfVariance) / firstHalfVariance;
                const trendScore = Math.min(Math.max(varianceImprovement * 60, -15), 15);
                const stabilityScore = Math.min(Math.max(15 * (1 - cv), -15), 15);
                
                explanation += `• 维护稳定性 (权重30%)：
  - 活动波动系数：${cv.toFixed(2)}
  - 波动改善率：${(varianceImprovement * 100).toFixed(1)}%
  - 评分说明：改善趋势(${Math.round(trendScore)}) + 当前稳定性(${Math.round(stabilityScore)})
  - 总得分：${Math.round(trendScore + stabilityScore)}\n\n`;
            }
            
            if (data.activity?.length >= 2) {
                const recentActivity = data.activity.slice(-6);
                const values = recentActivity.map(item => item.value);
                let gaps = 0;
                for (let i = 1; i < values.length; i++) {
                    if (values[i] < values[i-1] * 0.5) gaps++;
                }
                const growthRate = (values[values.length - 1] - values[0]) / values[0];
                const trendScore = Math.min(Math.max(growthRate * 60, -15), 15);
                const continuityScore = Math.min(Math.max(15 * (1 - gaps / values.length), -15), 15);
                
                explanation += `• 维护持续性 (权重30%)：
  - 活动中断次数：${gaps}次
  - 整体增长率：${(growthRate * 100).toFixed(1)}%
  - 评分说明：增长趋势(${Math.round(trendScore)}) + 连续性(${Math.round(continuityScore)})
  - 总得分：${Math.round(trendScore + continuityScore)}\n\n`;
            }
            
            explanation += `总分：${totalScore}`;
            break;

        default:
            explanation = '暂无评分说明';
    }

    return explanation;
};

const Dashboard = () => {
    const { selectedProjects } = useContext(ProjectContext);
    const [projectsData, setProjectsData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const handlePopoverOpen = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverContent('');
    };

    const open = Boolean(anchorEl);

    const algorithmExplanations = {
        codeQuality: loadingData ? '数据加载中...' : getDetailedScoreExplanation('codeQuality', projectsData),
        community: loadingData ? '数据加载中...' : getDetailedScoreExplanation('community', projectsData),
        impact: loadingData ? '数据加载中...' : getDetailedScoreExplanation('impact', projectsData),
        maintenance: loadingData ? '数据加载中...' : getDetailedScoreExplanation('maintenance', projectsData)
    };

    /**
     * 获取所有项目的数据
     */
    useEffect(() => {
        const fetchAllProjectsData = async () => {
            console.log('Starting to fetch data for projects:', selectedProjects);
            const allProjectsData = {};

            for (const projectName of selectedProjects) {
                try {
                    console.log(`Fetching data for ${projectName}...`);
                    // 分别编码组织名和仓库名
                    const [org, repo] = projectName.split('/');
                    if (!org || !repo) {
                        console.error(`Invalid project name format: ${projectName}`);
                        continue;
                    }
                    const encodedPath = `${encodeURIComponent(org)}/${encodeURIComponent(repo)}`;
                    const response = await fetch(`/api/data/${encodedPath}/all`);
                    console.log(`Response status for ${projectName}:`, response.status);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`Raw data for ${projectName}:`, data);
                        
                        // 将数据转换为时间序列格式
                        const formattedData = {};
                        Object.entries(data).forEach(([metricType, timeSeriesData]) => {
                            formattedData[metricType] = timeSeriesData.map(({ time, value }) => ({
                                time,
                                value: typeof value === 'number' ? value : parseFloat(value) || 0
                            })).sort((a, b) => a.time.localeCompare(b.time));
                        });

                        allProjectsData[projectName] = formattedData;
                        console.log(`Formatted data for ${projectName}:`, formattedData);
                    } else {
                        console.error(`Failed to load data for ${projectName}: ${response.status}`);
                        const errorText = await response.text();
                        console.error(`Error details for ${projectName}:`, errorText);
                        allProjectsData[projectName] = {};
                    }
                } catch (error) {
                    console.error(`Error loading data for ${projectName}:`, error);
                    allProjectsData[projectName] = {};
                }
            }

            console.log('Final all projects data:', allProjectsData);
            setProjectsData(allProjectsData);
            setLoadingData(false);
        };

        if (selectedProjects.length > 0) {
            console.log('Selected projects changed, fetching new data...');
            setLoadingData(true);
            fetchAllProjectsData();
        }
    }, [selectedProjects]);

    /**
     * 初始化图表
     */
    useEffect(() => {
        if (selectedProjects.length > 0 && Object.keys(projectsData).length > 0) {
            try {
                // 初始化图表配置
                ChartService.initCharts(selectedProjects, projectsData);
                // 获取生成的图表配置
                const options = ChartService.getChartOptions();
                console.log('Chart options:', options);
                setChartOptions(options);
            } catch (error) {
                console.error('Error initializing charts:', error);
            }
        }
    }, [selectedProjects, projectsData]);

    if (loadingData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="dashboard-container">
            <Header />
            <Box sx={{ mt: '64px' }}>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    {/* 项目信息栏 */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            mb: 4,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {selectedProjects.map((project) => (
                                <ProjectInfo key={project} project={project} />
                            ))}
                        </Box>
                    </Paper>

                    {/* 核心指标行 */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: 3, 
                            mb: 4,
                            flexWrap: 'wrap'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                flex: '1 1 calc(25% - 18px)',
                                minWidth: '200px',
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                                }
                            }}
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.codeQuality)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    代码质量与可维护性
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        fontSize: 16, 
                                        color: 'text.secondary',
                                        opacity: 0.7
                                    }} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 500 }}>
                                {calculateCodeQualityScore(projectsData)}
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: '1 1 calc(25% - 18px)',
                                minWidth: '200px',
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                                }
                            }}
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.community)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    社区活跃度与贡献
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        fontSize: 16, 
                                        color: 'text.secondary',
                                        opacity: 0.7
                                    }} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                {calculateCommunityScore(projectsData)}
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: '1 1 calc(25% - 18px)',
                                minWidth: '200px',
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                                }
                            }}
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.impact)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    项目影响力与应用
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        fontSize: 16, 
                                        color: 'text.secondary',
                                        opacity: 0.7
                                    }} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 500 }}>
                                {calculateImpactScore(projectsData)}
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: '1 1 calc(25% - 18px)',
                                minWidth: '200px',
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                                }
                            }}
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.maintenance)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    项目维护与更新
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        fontSize: 16, 
                                        color: 'text.secondary',
                                        opacity: 0.7
                                    }} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 500 }}>
                                {calculateMaintenanceScore(projectsData)}
                            </Typography>
                        </Paper>
                    </Box>

                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        PaperProps={{
                            sx: {
                                p: 2,
                                maxWidth: 300,
                                bgcolor: 'background.paper',
                                boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                                '& .MuiTypography-root': {
                                    whiteSpace: 'pre-line'
                                }
                            }
                        }}
                    >
                        <Typography variant="body2">
                            {popoverContent}
                        </Typography>
                    </Popover>

                    {/* 图表区域 */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {/* 项目关注度图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="project-attention-chart" chartOptions={chartOptions.projectAttentionOptions} />
                        </Box>

                        {/* OpenRank 图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="openrank-chart" chartOptions={chartOptions.openRankOptions} />
                        </Box>

                        {/* 代码变更行为图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="code-change-behavior-chart" chartOptions={chartOptions.codeChangeBehaviorOptions} />
                        </Box>

                        {/* PR 情况图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="pr-situation-chart" chartOptions={chartOptions.prSituationOptions} />
                        </Box>

                        {/* Issue 变化图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="issue-changes-chart" chartOptions={chartOptions.issueChangesOptions} />
                        </Box>

                        {/* 项目活跃度图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="project-activity-chart" chartOptions={chartOptions.projectActivityOptions} />
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Footer />

            <style jsx global>{`
                body {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    background-color: #ffffff;
                }
                .dashboard-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
