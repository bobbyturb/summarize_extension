#!/usr/bin/env python3
"""
本地 OpenAI API 代理
解决 Chrome 扩展 Service Worker 网络隔离问题
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import json
import sys

OPENAI_BASE_URL = "https://api.openai.com"
PORT = 8765

class ProxyHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """处理 CORS 预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        """转发 POST 请求到 OpenAI"""
        try:
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            # 构建转发请求
            target_url = OPENAI_BASE_URL + self.path
            print(f"[代理] 转发请求: {target_url}")

            req = urllib.request.Request(
                target_url,
                data=post_data,
                headers={
                    'Content-Type': self.headers.get('Content-Type', 'application/json'),
                    'Authorization': self.headers.get('Authorization', ''),
                },
                method='POST'
            )

            # 发送请求
            with urllib.request.urlopen(req) as response:
                response_data = response.read()

                # 返回响应
                self.send_response(response.status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response_data)

                print(f"[代理] 转发成功: {response.status}")

        except urllib.error.HTTPError as e:
            # 转发错误响应
            error_data = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(error_data)
            print(f"[代理] API 错误: {e.code}")

        except Exception as e:
            # 服务器错误
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = json.dumps({
                'error': {
                    'message': str(e),
                    'type': 'proxy_error'
                }
            }).encode()
            self.wfile.write(error_response)
            print(f"[代理] 异常: {e}")

    def do_GET(self):
        """转发 GET 请求到 OpenAI"""
        try:
            target_url = OPENAI_BASE_URL + self.path
            print(f"[代理] 转发 GET: {target_url}")

            req = urllib.request.Request(
                target_url,
                headers={
                    'Authorization': self.headers.get('Authorization', ''),
                }
            )

            with urllib.request.urlopen(req) as response:
                response_data = response.read()

                self.send_response(response.status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response_data)

                print(f"[代理] GET 成功: {response.status}")

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
            print(f"[代理] GET 异常: {e}")

    def log_message(self, format, *args):
        """自定义日志格式"""
        pass  # 使用自定义的 print 语句

def run_proxy():
    """运行代理服务器"""
    server = HTTPServer(('127.0.0.1', PORT), ProxyHandler)
    print(f"""
╔══════════════════════════════════════════════════════╗
║   OpenAI API 本地代理已启动                          ║
║                                                      ║
║   监听地址: http://127.0.0.1:{PORT}                   ║
║                                                      ║
║   在插件设置中配置:                                   ║
║   API Base URL: http://127.0.0.1:{PORT}/v1            ║
║                                                      ║
║   按 Ctrl+C 停止服务                                 ║
╚══════════════════════════════════════════════════════╝
""")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[代理] 服务已停止")
        server.shutdown()

if __name__ == '__main__':
    run_proxy()
