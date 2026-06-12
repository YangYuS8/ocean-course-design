<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthUserManagementTest extends TestCase
{
    use RefreshDatabase;

    private function createTokenFor(User $user): string
    {
        $token = 'test-token-'.$user->id;
        $user->forceFill(['api_token_hash' => hash('sha256', $token)])->save();

        return $token;
    }

    public function test_logs_in_and_returns_current_user(): void
    {
        User::factory()->create([
            'name' => '管理员',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $login = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ])->assertOk()
            ->assertJsonPath('user.email', 'admin@example.com')
            ->assertJsonPath('user.role', 'admin');

        $token = $login->json('token');
        $this->assertIsString($token);
        $this->assertNotEmpty($token);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('email', 'admin@example.com');
    }

    public function test_allows_admin_to_manage_users_and_blocks_normal_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $normal = User::factory()->create(['role' => 'user']);
        $adminToken = $this->createTokenFor($admin);
        $normalToken = $this->createTokenFor($normal);

        $this->withHeader('Authorization', 'Bearer '.$normalToken)
            ->getJson('/api/users')
            ->assertForbidden();

        $created = $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->postJson('/api/users', [
                'name' => '巡检员',
                'email' => 'inspector@example.com',
                'password' => 'password',
                'role' => 'user',
            ])->assertCreated()
            ->assertJsonPath('email', 'inspector@example.com');

        $userId = $created->json('id');

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->getJson('/api/users')
            ->assertOk()
            ->assertJsonFragment(['email' => 'inspector@example.com']);

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->putJson('/api/users/'.$userId, ['name' => '高级巡检员', 'role' => 'admin'])
            ->assertOk()
            ->assertJsonPath('name', '高级巡检员')
            ->assertJsonPath('role', 'admin');

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->deleteJson('/api/users/'.$userId)
            ->assertNoContent();
    }

    public function test_protects_the_last_admin_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $adminToken = $this->createTokenFor($admin);

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->putJson('/api/users/'.$admin->id, ['role' => 'user'])
            ->assertStatus(422)
            ->assertJsonPath('message', '至少需要保留一名管理员');

        $secondAdmin = User::factory()->create(['role' => 'admin']);

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->deleteJson('/api/users/'.$secondAdmin->id)
            ->assertNoContent();

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->putJson('/api/users/'.$admin->id, ['role' => 'user'])
            ->assertStatus(422);
    }

    public function test_logs_out_by_invalidating_token(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $this->createTokenFor($user);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout')
            ->assertNoContent();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/me')
            ->assertUnauthorized();
    }
}
