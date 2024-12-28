// utils/helpers.js

/**
 * 过滤项目列表，只保留那些没有子项目的最深层级项目
 * @param {Array<string>} projects - 所有项目路径数组
 * @returns {Array<string>} - 仅包含最深层级项目的数组
 */
export function getDeepestProjects(projects) {
    return projects.filter(project => 
        !projects.some(other => other.startsWith(`${project}/`))
    );
}
