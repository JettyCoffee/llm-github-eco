import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        const { project } = req.query;
        
        if (!project) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        try {
            // 尝试从Supabase获取缓存数据
            const { data, error } = await supabase
                .from('github_cache')
                .select('*')
                .eq('project_name', project)
                .single();

            if (error) {
                // 如果表不存在或没有数据，返回404
                return res.status(404).json({ error: 'No cached data found' });
            }

            return res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching cached data:', error);
            return res.status(500).json({ error: 'Failed to fetch cached data' });
        }
    }

    if (method === 'POST') {
        const { project, data } = req.body;
        
        if (!project || !data) {
            return res.status(400).json({ error: 'Project name and data are required' });
        }

        try {
            // 尝试更新现有记录或插入新记录
            const { data: result, error } = await supabase
                .from('github_cache')
                .upsert({
                    project_name: project,
                    data: data,
                    last_updated: new Date().toISOString()
                }, {
                    onConflict: 'project_name'
                });

            if (error) {
                console.error('Error saving cached data:', error);
                return res.status(500).json({ error: 'Failed to save cached data' });
            }

            return res.status(200).json({ message: 'Cache updated successfully' });
        } catch (error) {
            console.error('Error saving cached data:', error);
            return res.status(500).json({ error: 'Failed to save cached data' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
} 