<?php

namespace Tests\Feature;

use PHPUnit\Framework\TestCase;

class DockerDatabasePersistenceTest extends TestCase
{
    public function test_docker_start_script_does_not_clear_existing_sqlite_database(): void
    {
        $script = file_get_contents(__DIR__.'/../../docker/start-backend.sh');

        // Docker 重启时只应确保 SQLite 文件存在，不能执行会截断数据库的重定向命令。
        // 这里使用正则只检查“真实命令行”，避免中文说明注释中的示例文字造成误判。
        $this->assertDoesNotMatchRegularExpression('/^\s*:\s*>\s*database\/database\.sqlite\s*$/m', $script);
        $this->assertMatchesRegularExpression('/^\s*touch\s+database\/database\.sqlite\s*$/m', $script);
    }
}
