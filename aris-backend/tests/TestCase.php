<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /** Simulate the configured first-party React SPA for Sanctum session routes. */
    protected function fromStatefulSpa(): static
    {
        return $this->withHeader('Origin', 'http://localhost:5173');
    }
}
