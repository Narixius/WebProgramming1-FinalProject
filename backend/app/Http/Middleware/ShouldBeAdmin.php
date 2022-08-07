<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ShouldBeAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (!in_array("ROLE_ADMIN", json_decode($request->user()->role))) {
            return response()->json([
                "message"=>'This action is unauthorized.'
            ], 401);
        }
        return $next($request);
    }
}
