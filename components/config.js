import data from '../config.json' assert { type: 'json' };

export default function Config() {
    return {
        rl_port: data["rl"]["port"],
        rl_host: data["rl"]["host"],
        visualize_port: data["visualize"]["port"],
        visualize_host: data["visualize"]["host"],
    }
}
