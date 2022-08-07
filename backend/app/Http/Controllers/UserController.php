<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use OpenApi\Annotations as OA;

class UserController extends Controller
{
    /**
     * All users list
     *
     * @OA\Get(
     *     path="/user",
     *     tags={"user"},
     *     operationId="getUsers",
     *     @OA\Response(
     *         response=405,
     *         description="Invalid input"
     *     )
     * )
     */
    function getAll() {
        return response()->json(User::all());
    }

    /**
     * Find a specific user
     *
     * @OA\Get(
     *     path="/user/{id}",
     *     tags={"user"},
     *     operationId="getUsers",
     *     @OA\Response(
     *         response=405,
     *         description="Invalid input"
     *     ),
     *     @OA\Parameter(
     *         description="User id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(type="string"),
     *         @OA\Examples(example="int", value="1", summary="An int value.")
     *     ),
     * )
     */
    function findUser($userId) {
        $user = User::find($userId);
        if(!$user)
            return response()->json([
                "message" => "User not found!"
            ], 404);
        return response()->json($user);
    }

    /**
     * Create a new user
     *
     * @OA\Post(
     *     path="/user",
     *     tags={"user"},
     *     operationId="createUser",
     *     @OA\Response(
     *         response=405,
     *         description="Invalid input"
     *     )
     * )
     */
    function create(Request $request) {
        /** @var USer $user */
        $post_data = $request->validate([
            "name"=>"required|string|max:255",
            "password" => "required|string|min:8",
            'email'=>'required|string|email|unique:users',
        ]);
        $user = User::create([
            ...$post_data,
            'password'=>Hash::make($post_data['password']),
            'role'=>json_encode(["ROLE_USER"])
        ]);
        return response()->json($user);
    }

    /**
     * Update a user
     *
     * @OA\Patch(
     *     path="/user/{id}",
     *     tags={"user"},
     *     operationId="updateUser",
     *     @OA\Response(
     *         response=405,
     *         description="Invalid input"
     *     ),
     *     @OA\Parameter(
     *         description="User id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(type="string"),
     *         @OA\Examples(example="int", value="1", summary="An int value.")
     *     ),
     * )
     */
    function update($userId, Request $request) {
        /** @var USer $user */
        $user = User::find($userId);
        $post_data = $request->validate([
            "name"=>"string|max:255",
            "password" => "string|min:8",
            'email'=>'string|email|unique:users',
        ]);
        if(!$user)
            return response()->json([
                "message" => "User not found!"
            ], 404);
        if(isset($post_data['password']))
            $post_data['password'] = Hash::make($post_data['password']);
        $user->update($post_data);
        return response()->json($user);
    }
    /**
     * Delete a user
     *
     * @OA\Delete(
     *     path="/user/{id}",
     *     tags={"user"},
     *     operationId="deleteUser",
     *     @OA\Response(
     *         response=405,
     *         description="Invalid input"
     *     ),
     *     @OA\Parameter(
     *         description="User id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(type="string"),
     *         @OA\Examples(example="int", value="1", summary="An int value.")
     *     ),
     * )
     */
    function delete($userId) {
        $user = User::find($userId);
        if(!$user)
            return response()->json([
                "message" => "User not found!"
            ], 404);
        if($user->id == Auth::user()->id)
            return response()->json([
                "message" => "You cannot remove yourself!"
            ], 403);
        $user->delete();
        return response()->json([
            "message" => "Ok"
        ]);
    }
}
