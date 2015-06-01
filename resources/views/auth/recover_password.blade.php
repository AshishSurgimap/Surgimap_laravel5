@extends('app')

@section('title', 'Login')

@section('content')
<div class="container-fluid">
	<div class="row">
		<div class= "header-login">
			<div class="col-md-11 col-md-offset-1">
				<span>Login</span>
				<hr>
			</div>
		</div>
		<div class="col-md-4 col-md-offset-1">
			<div class="panel">
				@if (count($errors) > 0)
					<div class="alert alert-danger">
						<strong>Whoops!</strong> There were some problems with your input.<br><br>
						<ul>
							@foreach ($errors->all() as $error)
								<li>{{ $error }}</li>
							@endforeach
						</ul>
					</div>
				@endif
				<form role="form" method="POST" action="{{ url('/auth/login') }}">
				    <input type="hidden" name="_token" value="{{ csrf_token() }}">
				    <div class="row">
						<div class="col-lg-9">
						    <div class="form-group">
						        <label for="inputEmail">Email</label>
						        <input type="email" class="form-control" name="email" value="{{ old('email') }}"  placeholder="Email">
						    </div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-9">
						    <div class="form-group">
						        <label for="inputPassword">Password</label>
						        <input type="password" class="form-control" name="password" placeholder="Password">
						    </div>
						</div>
					</div>
					<div class="form-group">
						<button type="submit" class="btn btn-primary">Login</button>
				        <div class= "forgot-pass">
				        	Forgot Passwords?
							<a href="{{ url('/auth/recover_password') }}">Click here to recover it!</a>
							<!-- TO=DO - Add HREF -->
				    	</div>
				    </div>
				</form>
			</div>
		</div>
	</div>
</div>
@endsection
